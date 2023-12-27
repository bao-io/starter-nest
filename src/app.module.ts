import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as useragent from 'express-useragent'
import { AppController } from './app.controller'
import * as modules from './modules'

@Module({
  imports: Object.values(modules),
  controllers: [AppController],
})
export class AppModule implements NestModule {
  static port: number
  constructor(private configService: ConfigService) {
    AppModule.port = this.configService.get('app.port')
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(useragent.express()).forRoutes('*')
  }
}
