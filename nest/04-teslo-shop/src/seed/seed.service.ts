import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Product } from '../products/entities';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
  ) {}

  async populateDb(): Promise<Product[]> {
    await this.cleanTables();
    const users = await this.authService.registerUserBatch(initialData.users);
    return await this.productsService.createBatch(initialData.products, users);
  }

  private async cleanTables(): Promise<void> {
    await this.productsService.deleteAllProducts();
    await this.authService.deleteAllUsers();
  }
}
