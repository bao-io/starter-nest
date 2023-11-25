import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ValidationPipe,
  DatabaseModule,
  CorsMiddleware,
  OriginMiddleware,
} from './framework';
import helmet from 'helmet';
import compression from 'compression';
import * as useragent from 'express-useragent';
import configuration from './app.config';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 5, // 5 minutes
        limit: 300, // 300 limit
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    { useClass: ThrottlerGuard, provide: APP_GUARD },
    { useClass: ValidationPipe, provide: APP_PIPE },
  ],
})
export class AppModule implements NestModule {
  static port: number;
  static apiPrefix: string;
  constructor(private configService: ConfigService) {
    AppModule.port = this.configService.get('app.port');
    AppModule.apiPrefix = this.configService.get('app.apiPrefix');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorsMiddleware,
        OriginMiddleware,
        helmet(),
        compression(),
        useragent.express(),
      )
      .forRoutes('*');
  }
}
