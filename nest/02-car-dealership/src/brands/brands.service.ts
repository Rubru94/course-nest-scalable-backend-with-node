import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    {
      id: uuid(),
      name: 'Toyota',
      createdAt: new Date().getTime(),
    },
  ];

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find((brand) => brand.id === id);
    if (!brand) throw new NotFoundException(`Brand with id '${id}' not found`);
    return brand;
  }

  create(createBrandDto: CreateBrandDto) {
    const newBrand = new Brand(createBrandDto);
    this.brands.push(newBrand);
    return newBrand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    if (updateBrandDto.id && updateBrandDto.id !== id)
      throw new BadRequestException(
        'Payload brand id is different from path param',
      );

    let brandDb = this.findOne(id);

    this.brands = this.brands.map((brand) => {
      if (brand.id === id) {
        brandDb = { ...brandDb, ...updateBrandDto, id };
        return brandDb;
      }
      return brand;
    });

    return brandDb;
  }

  remove(id: string) {
    const brandDb = this.findOne(id);

    this.brands = this.brands.filter((brand) => brand.id !== id);

    return brandDb;
  }
}
