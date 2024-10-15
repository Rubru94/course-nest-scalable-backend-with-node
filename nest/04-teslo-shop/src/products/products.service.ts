import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, In, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; // it can be used method from class-validator too --> import { isUUID } from 'class-validator';
import { Product, ProductImage } from './entities';
import { CreateProductDto, PlainProductDto, UpdateProductDto } from './dto';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<PlainProductDto> {
    try {
      const { images = [], ...productDetails } = createProductDto; // In this case operator rest is used, not spread. (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(
          (image) => this.productImageRepository.create({ url: image }), // As images are being created within the product creation typeorm takes care of inferring the rest and assigns the id of each product to the respective image.
        ),
      });
      await this.productRepository.save(product);
      return new PlainProductDto(product);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PlainProductDto[]> {
    const { limit = 10, offset = 0 } = paginationDto; // --> handle default values

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map((product) => new PlainProductDto(product));
  }

  async findOne(term: string): Promise<Product> {
    let product: Product;
    if (isUUID(term))
      product = await this.productRepository.findOneBy({ id: term });
    else {
      const qb = this.productRepository.createQueryBuilder('prod');
      product = await qb
        .where(
          'UPPER(title)=:title or slug=:slug', // slug is always in lowercase & exact match is desired
          {
            title: term.toUpperCase(),
            slug: term, // if an exact match is not desired --> term.toLowerCase(),
          },
        )
        .leftJoinAndSelect('prod.images', 'prodImages') // Eager relations only work when you use find* methods. If you use QueryBuilder eager relations are disabled and have to use leftJoinAndSelect to load the relation.
        .getOne();
    }

    if (!product)
      throw new NotFoundException(
        `Not found product with term(id, title or slug): ${term}`,
      );
    return product;
  }

  async findOnePlain(term: string): Promise<PlainProductDto> {
    const product = await this.findOne(term);
    return new PlainProductDto(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...rest } = updateProductDto;

    const productImages = await this.productImageRepository.findBy({
      product: { id },
    });
    const product = await this.productRepository.preload({
      id,
      ...rest,
    });
    if (!product)
      throw new NotFoundException(`Not found product with id: ${id}`);

    // Create query runner
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      if (images) {
        const urlsToDelete = productImages
          .map(({ url }) => url)
          .filter((url) => !images.includes(url));
        const urlsToCreate = images.filter(
          (imageUrl) => !productImages.map(({ url }) => url).includes(imageUrl),
        );
        const imagesRemaining = productImages.filter(({ url }) =>
          images.includes(url),
        );

        // delete made by query runner, we can also use the repository --> this.productImageRepository.delete(criteria)
        await qr.manager.delete(ProductImage, {
          product: { id },
          url: In(urlsToDelete),
        });

        if (urlsToCreate.length > 0) {
          product.images = [
            ...imagesRemaining,
            ...urlsToCreate.map((image) =>
              this.productImageRepository.create({ url: image }),
            ),
          ];
        }
      }

      await qr.manager.save(product);

      await qr.commitTransaction();
      await qr.release(); // Close query runner

      return this.findOnePlain(id);
    } catch (error) {
      await qr.rollbackTransaction();
      await qr.release(); // Close query runner
      this.handleDBException(error);
    }
  }

  async remove(id: string): Promise<PlainProductDto> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product); // remove by criteria --> await this.productRepository.delete({ id });
    return new PlainProductDto(product);
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
