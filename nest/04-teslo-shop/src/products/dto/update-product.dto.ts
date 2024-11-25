// import { PartialType } from '@nestjs/mapped-types'; // @nestjs/mapped-types does not take swagger decorators by default. We can fix this by using PartialType of @nestjs/swagger.
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
