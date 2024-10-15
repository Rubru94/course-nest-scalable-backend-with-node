import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';
import { PlainProductDto } from '../products/dto';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async populateDb(): Promise<PlainProductDto[]> {
    return await this.insertNewProducts();
  }

  private async insertNewProducts(): Promise<PlainProductDto[]> {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    return await Promise.all(insertPromises);
  }
}
