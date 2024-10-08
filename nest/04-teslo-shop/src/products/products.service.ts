import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; // it can be used method from class-validator too --> import { isUUID } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { images = [], ...productDetails } = createProductDto; // In this case operator rest is used, not spread. (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(
          (image) => this.productImageRepository.create({ url: image }), // As images are being created within the product creation typeorm takes care of inferring the rest and assigns the id of each product to the respective image.
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images } as Product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto; // --> handle default values
    return this.productRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string): Promise<Product> {
    let product: Product;
    if (isUUID(term))
      product = await this.productRepository.findOneBy({ id: term });
    else {
      const qb = this.productRepository.createQueryBuilder();
      product = await qb
        .where(
          'UPPER(title)=:title or slug=:slug', // slug is always in lowercase & exact match is desired
          {
            title: term.toUpperCase(),
            slug: term, // if an exact match is not desired --> term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!product)
      throw new NotFoundException(
        `Not found product with term(id, title or slug): ${term}`,
      );
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      images: [],
    });
    if (!product)
      throw new NotFoundException(`Not found product with id: ${id}`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product); // remove by criteria --> await this.productRepository.delete({ id });
    return product;
  }

  private handleDBException = (error: any) => {
    const POSTGRESQL_UNIQUE_VIOLATION_ERROR = '23505';
    const { code, detail } = error;

    if (code === POSTGRESQL_UNIQUE_VIOLATION_ERROR)
      throw new BadRequestException(detail);

    this.logger.error(error, { ...error }); // print error as log & error object detailed
    throw new InternalServerErrorException(
      'Unexpected error, check server logs.',
    );
  };
}
