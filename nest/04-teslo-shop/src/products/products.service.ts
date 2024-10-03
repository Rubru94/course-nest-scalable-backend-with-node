import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Not found product with id: ${id}`);
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
