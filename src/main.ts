import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './shared/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
