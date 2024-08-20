import { CreateBrandDto } from '../dto/create-brand.dto';
import { v4 as uuid } from 'uuid';

export class Brand {
  id: string;
  name: string;
  createdAt: number;
  updatedAt?: number;

  constructor(brand?: Partial<CreateBrandDto>) {
    const date = new Date().getTime();

    this.id = uuid();
    this.name = brand?.name ?? '';
    this.createdAt = date;
    this.updatedAt = date;
  }
}
