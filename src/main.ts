import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './framework';
console.log(process.env.TEST);

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  return app
    .setGlobalPrefix(AppModule.apiPrefix)
    .useGlobalFilters(new HttpExceptionFilter())
    .listen(AppModule.port)
    .then(() => AppModule.port);
};

bootstrap().then((port) => {
  Logger.log(`Application running on port: ${port}`, 'MainApplication');
});
