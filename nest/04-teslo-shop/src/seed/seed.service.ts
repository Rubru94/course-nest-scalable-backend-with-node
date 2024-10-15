import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  async populateDb() {
    return 'This action adds a new seed';
  }
}
