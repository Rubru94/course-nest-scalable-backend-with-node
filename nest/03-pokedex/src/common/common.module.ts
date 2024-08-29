import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { FetchAdapter } from './adapters';

@Module({
  providers: [AxiosAdapter, FetchAdapter],
  exports: [AxiosAdapter, FetchAdapter],
})
export class CommonModule {}
