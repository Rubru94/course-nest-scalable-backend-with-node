import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid'; // it can be used method from class-validator too --> import { isUUID } from 'class-validator';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto; // --> handle default values
    console.log({ limit, offset });
    return this.productRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string): Promise<Product> {
    let findOptions: FindOptionsWhere<Product> = { slug: term };
    if (isUUID(term)) findOptions = { id: term };

    const product = await this.productRepository.findOneBy(findOptions);
    if (!product)
      throw new NotFoundException(`Not found product with id: ${term}`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
