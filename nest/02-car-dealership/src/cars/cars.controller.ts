import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './car.interface';

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

  @Post()
  create(@Body() body: Car) {
    return body;
  }

  @Patch()
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Car) {
    return body;
  }

  @Delete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
