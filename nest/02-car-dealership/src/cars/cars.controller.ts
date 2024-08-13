import { Controller, Get, Param } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly service: CarsService) {}

  @Get()
  getAll() {
    // return this.cars;
    return this.service.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    // console.log({ id });
    // return { id, car: this.cars[id] };
    return this.service.findById(+id);
  }
}
