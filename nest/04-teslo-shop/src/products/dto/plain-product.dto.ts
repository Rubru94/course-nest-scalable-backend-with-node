import { Product } from '../entities';

export class PlainProductDto {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  images: string[];

  constructor({ images, ...rest }: Product) {
    Object.assign(this, rest);
    this.images = images.map((image) => image.url);
  }
}
