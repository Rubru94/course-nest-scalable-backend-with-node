import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRole } from '../enums/valid-role.enum';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '935cb0da-81cf-4cbd-8a81-1a762043a9a3',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test1@mail.com',
    description: 'User email',
    uniqueItems: true,
    pattern: 'email',
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: '$2b$10$BPPfFG924J8l6HXrzDPWHOt4YUs6fYDomt4.zL8cdejjppcJutFki',
    description: 'User password',
    pattern: 'encrypted (bcrypt)',
  })
  @Column('text', { select: false }) // select --> Indicates if column is always selected by QueryBuilder and find operations. Default value is "true".
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User fullname',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'User is active',
    default: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: [ValidRole.User, ValidRole.Admin],
    description: 'User roles',
    default: [ValidRole.User],
  })
  @Column('text', { array: true, default: [ValidRole.User] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
