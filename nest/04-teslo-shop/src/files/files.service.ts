import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  findProductImagePath(name: string): string {
    const path = join(__dirname, '../../static/products', name);

    if (!existsSync(path))
      throw new NotFoundException(`Product image ${name} not found`);

    return path;
  }
}
