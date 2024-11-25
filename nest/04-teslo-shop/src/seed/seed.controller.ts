import { Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from '../products/entities';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({
    status: 201,
    description: 'Product seed with users related created',
    type: [Product],
  })
  @Post()
  populateDb(): Promise<Product[]> {
    return this.seedService.populateDb();
  }
}
