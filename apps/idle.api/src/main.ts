/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ContextIdFactory, NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './modules/app';
import { AggregateByTenantContextIdStrategy } from './config/ContextIdStrategy';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
