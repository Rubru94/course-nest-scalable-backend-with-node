import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { Gender } from '../../common/enums';
import { Product } from '../entities';

export class PlainProductDto {
  @ApiProperty({
    example: 'd555a430-e761-42e9-b9ff-72b1bb23d42e',
    description: 'Product ID',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  title: string;

  @ApiProperty({
    example: 15.99,
    description: 'Product price',
    default: 0,
    required: false,
  })
  price: number;

  @ApiProperty({
    example: 'For the future space traveler with discerning taste ...',
    description: 'Product description',
    nullable: true,
    default: null,
    required: false,
  })
  description: string;

  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product slug - for SEO',
    uniqueItems: true,
    required: false,
  })
  slug: string;

  @ApiProperty({
    example: 20,
    description: 'Product stock',
    default: 0,
    required: false,
  })
  stock: number;

  @ApiProperty({
    example: ['SM', 'M', 'L'],
    description: 'Product sizes',
  })
  sizes: string[];

  @ApiProperty({
    example: Gender.Female,
    description: 'Product gender',
  })
  gender: string;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags',
    required: false,
  })
  tags: string[];

  @ApiProperty({
    example: ['7654420-00-A_0_2000.jpg', '7654420-00-A_1_2000.jpg'],
    description: 'Product images urls',
    required: false,
  })
  images: string[];

  @ApiProperty({
    description: 'Product user',
    type: User,
  })
  user: User;

  constructor({ images, ...rest }: Product) {
    Object.assign(this, rest);
    this.images = images ? images.map((image) => image.url) : [];
  }
}
