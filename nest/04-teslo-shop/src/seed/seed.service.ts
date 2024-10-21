import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/entities';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async populateDb(): Promise<Product[]> {
    await this.productsService.deleteAllProducts();
    return await this.productsService.createBatch(initialData.products);
  }
}
