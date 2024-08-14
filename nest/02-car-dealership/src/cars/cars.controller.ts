import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';

@Controller('cars')
// @UsePipes(ValidationPipe) // --> UsePipes can be used at method, controller or application level
export class CarsController {
  constructor(private readonly service: CarsService) {}

  @Get()
  getAll() {
    // return this.cars;
    return this.service.findAll();
  }

  @Get('/:id')
  // new ParseUUIDPipe({ version: '4' }) --> we can specify uuid version for ParseUUIDPipe
  getById(@Param('id', ParseUUIDPipe) id: string) {
    // console.log({ id });
    return this.service.findById(id);
  }

  @Post()
  // @UsePipes(ValidationPipe)
  create(@Body() createCarDto: CreateCarDto) {
    return this.service.create(createCarDto);
  }

  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.service.update(id, updateCarDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}
