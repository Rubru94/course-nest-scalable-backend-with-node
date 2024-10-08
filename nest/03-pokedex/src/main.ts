import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        // transform data through dtos --> query params string to type
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`App runnig on port ${port}`);
}
bootstrap();
