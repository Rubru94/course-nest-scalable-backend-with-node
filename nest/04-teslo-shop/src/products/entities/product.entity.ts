import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Gender } from '../../common/enums';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'd555a430-e761-42e9-b9ff-72b1bb23d42e',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid' /* , { name: 'ID' } */) // options like column name in DB
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 15.99,
    description: 'Product price',
    default: 0,
    required: false,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'For the future space traveler with discerning taste ...',
    description: 'Product description',
    nullable: true,
    default: null,
    required: false,
  })
  @Column({ type: 'text', nullable: true }) // different ways to use @Column() decorator
  description: string;

  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product slug - for SEO',
    uniqueItems: true,
    required: false,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 20,
    description: 'Product stock',
    default: 0,
    required: false,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['SM', 'M', 'L'],
    description: 'Product sizes',
  })
  @Column('text', { array: true }) // array --> supported only by postgres --> We can afford not to use another table for sizes because it has been established that it is not null, i.e. there will never be a product without sizes. Otherwise, according to database normalization rules we should create another table for the relationship.
  sizes: string[];

  @ApiProperty({
    example: Gender.Female,
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags',
    required: false,
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({
    // To avoid circular dependence on swagger, only documentation on the property with eager is specified & typed as arrow function () => {}.
    description: 'Product images',
    required: false,
    type: () => [ProductImage],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
  })
  images?: ProductImage[];

  @ApiProperty({
    description: 'Product user',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  // @JoinColumn({ name: 'user_id' }) // Set related column name of products table from DB
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.sanitizeSlug();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.sanitizeSlug();
  }

  /**
   * Replace slug chars ' ' by '_' & "'" by ''
   *
   * @private
   * @returns {string}
   */
  private sanitizeSlug(): string {
    return this.slug
      .toLocaleLowerCase()
      .replace(/ |'/g, (match) => (match === ' ' ? '_' : '')); // equal to --> .replace(/ /g, '_').replace(/'/g, '')
  }
}
