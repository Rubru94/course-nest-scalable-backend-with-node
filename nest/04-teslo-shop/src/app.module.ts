import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

const PRODUCTION_STAGE = 'prod';
const isProd = process.env.STAGE === PRODUCTION_STAGE;

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: isProd,
      extra: {
        ssl: isProd ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: Boolean(process.env.DB_SYNCHRONIZE), // It shouldn't be used in production - otherwise you can lose production data.
    }),
    // It is possible to retrieve the images on the url: http://localhost:3000/products/[image-name]
    // ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    CommonModule,
    ProductsModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
})
export class AppModule {}
