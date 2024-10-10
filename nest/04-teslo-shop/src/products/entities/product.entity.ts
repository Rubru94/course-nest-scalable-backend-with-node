import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid' /* , { name: 'ID' } */) // options like column name in DB
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true }) // different ways to use @Column() decorator
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true }) // array --> supported only by postgres --> We can afford not to use another table for sizes because it has been established that it is not null, i.e. there will never be a product without sizes. Otherwise, according to database normalization rules we should create another table for the relationship.
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImage[];

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
