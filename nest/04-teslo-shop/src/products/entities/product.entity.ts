import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid' /* , { name: 'ID' } */) // options like column name in DB
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('numeric', { default: 0 })
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
}
