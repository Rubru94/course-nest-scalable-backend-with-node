import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Car } from './models/car.model';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [{ id: uuid(), brand: 'Toyota', model: 'Corolla' }];

  findAll() {
    return this.cars;
  }

  findById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException(`Car with id '${id}' not found`);

    return car;
  }

  create(createCarDto: CreateCarDto): Car {
    /* const newCar: Car = {
      id: uuid(),
      ...createCarDto,
    }; */

    const newCar = new Car(createCarDto);

    this.cars.push(newCar);

    return newCar;
  }

  update(id: string, updateCarDto: UpdateCarDto): Car {
    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException(
        'Payload car id is different from path param',
      );

    let carDb = this.findById(id);

    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        carDb = { ...carDb, ...updateCarDto, id };
        return carDb;
      }
      return car;
    });

    return carDb;
  }

  delete(id: string): Car {
    const carDb = this.findById(id);

    this.cars = this.cars.filter((car) => car.id !== id);

    return carDb;
  }

  fillWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
