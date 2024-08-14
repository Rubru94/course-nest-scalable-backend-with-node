import { v4 as uuid } from 'uuid';
import { CreateCarDto } from '../dto/create-car.dto';
import { ICar } from '../interfaces/car.interface';

export class Car implements ICar {
  id: string;
  brand: string;
  model: string;

  constructor(createCarDto?: Partial<CreateCarDto>) {
    this.id = uuid();
    this.brand = createCarDto?.brand ?? '';
    this.model = createCarDto?.model ?? '';
  }
}
