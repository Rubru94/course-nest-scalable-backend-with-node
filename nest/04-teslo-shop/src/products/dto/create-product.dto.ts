import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums';

export class CreateProductDto {
  @ApiProperty({
    example: 'Fancy T Logo Shirt',
    description: 'Product title',
    nullable: false,
    minLength: 1,
    // type: String, // documentation detail can be as much or as little as you wish
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 30,
    description: 'Product price',
    nullable: false,
    minimum: 0,
    exclusiveMinimum: true,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'Designed for comfort and style ...',
    description: 'Product description',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'fancy_t_logo_shirt',
    description: 'Product slug',
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 20,
    description: 'Product stock',
    nullable: false,
    minimum: 0,
    exclusiveMinimum: true,
    required: false,
    default: 0,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['SM', 'M', 'L'],
    description: 'Product sizes',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: Gender.Female,
    description: 'Product gender',
  })
  @IsIn([Gender.Male, Gender.Female, Gender.Kid, Gender.Unisex])
  gender: string;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags',
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['7654420-00-A_0_2000.jpg', '7654420-00-A_1_2000.jpg'],
    description: 'Product images urls',
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
