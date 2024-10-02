import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid' /* , { name: 'ID' } */) // options like column name in DB
  id: string;

  @Column('text', { unique: true })
  title: string;
}
