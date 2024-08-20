import { Car } from 'src/cars/models/car.model';

export const CARS_SEED: Car[] = [
  new Car({ brand: 'Toyota', model: 'Corolla' }),
  new Car({ brand: 'Subaru', model: 'Impreza' }),
  new Car({ brand: 'Honda', model: 'Civic' }),
];
