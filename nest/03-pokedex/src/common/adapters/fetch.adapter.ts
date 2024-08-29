import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(
        // fetch requires node version > 18
        url,
        { method: 'GET' },
      );
      return (await response.json()) as Promise<T>;
    } catch (error) {
      throw new Error('FetchAdapter error - check logs');
    }
  }
}
