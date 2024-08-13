import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
  getById(@Param('id', ParseIntPipe) id: number) {
    console.log({ id });

    // throw new Error('Error'); // --> return 500 error

    return this.service.findById(id);
  }
}
