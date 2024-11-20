import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  /* @Auth(ValidRole.Admin) */
  populateDb() {
    return this.seedService.populateDb();
  }
}
