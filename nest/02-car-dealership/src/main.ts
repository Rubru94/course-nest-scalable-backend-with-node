import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // --> remove non expected data (without decorators)
      forbidNonWhitelisted: true, // --> return error with non expected data (without decorators)
    }),
  );

  await app.listen(3000);
}
bootstrap();
