import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; // it can be used method from class-validator too --> import { isUUID } from 'class-validator';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { handleDBException } from '../common/handlers/error.handler';
import { getRandomInt } from '../common/helpers/random.helper';
import { CreateProductDto, PlainProductDto, UpdateProductDto } from './dto';
import { Product, ProductImage } from './entities';

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

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<PlainProductDto> {
    try {
      const product = this.createProduct(createProductDto, user);
      await this.productRepository.save(product);
      return new PlainProductDto(product);
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  async createBatch(
    createProductDtoCollection: CreateProductDto[],
    users: User[],
  ) {
    try {
      const products = createProductDtoCollection.map((product) =>
        this.createProduct(product, users[getRandomInt(users.length)]),
      );
      return await this.productRepository.save(products);
    } catch (error) {
      handleDBException(error, this.logger);
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
        .leftJoinAndSelect('prod.user', 'prodUser')
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<PlainProductDto> {
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

      product.user = user;
      await qr.manager.save(product);

      await qr.commitTransaction();
      await qr.release(); // Close query runner

      return this.findOnePlain(id);
    } catch (error) {
      await qr.rollbackTransaction();
      await qr.release(); // Close query runner
      handleDBException(error, this.logger);
    }
  }

  async remove(id: string): Promise<PlainProductDto> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product); // remove by criteria --> await this.productRepository.delete({ id });
    return new PlainProductDto(product);
  }

  async deleteAllProducts(): Promise<DeleteResult> {
    const qb = this.productRepository.createQueryBuilder('product');

    try {
      return await qb.delete().where({}).execute();
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  private createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Product {
    const { images = [], ...productDetails } = createProductDto; // In this case operator rest is used, not spread. (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

    return this.productRepository.create({
      ...productDetails,
      user,
      images: images.map(
        (image) => this.productImageRepository.create({ url: image }), // As images are being created within the product creation typeorm takes care of inferring the rest and assigns the id of each product to the respective image.
      ),
    });
  }
}
