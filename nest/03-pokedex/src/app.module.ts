import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/env.config';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }), // env --> set as first import --> before other modules that use it
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    // console.log({ env: process.env });
  }
}
