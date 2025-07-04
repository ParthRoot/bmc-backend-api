import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { currentEnv, getEnv, loadEnv } from './utils/env.util';
import { RequestMethod } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/dispatchers/exception.dispatchers';
import { TransformInterceptor } from './utils/dispatchers/transform.dispatchers';
import { ValidationPipe } from './utils/pipe/validation.pipe';
import { RequestLoggerMiddleware } from './utils';

const compression = require('compression');
async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    bufferLogs: true,
  });
  app.use(compression());
  app.enableCors();
  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ],
  });
  app.use(new RequestLoggerMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const port = getEnv('BACKEND_PORT');
  // const port = 7007;
  app.listen(port, () =>
    console.log(`Server started port=${port}, url=http://0.0.0.0:${port}, env=${currentEnv()}`),
  );
}
bootstrap();
