import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import configuration from './app.config'

@Module({
  imports: [
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
  ],
  controllers: [AppController],
})
export class AppModule {
  static port: number
  constructor(private configService: ConfigService) {
    AppModule.port = this.configService.get('app.port')
  }
}
