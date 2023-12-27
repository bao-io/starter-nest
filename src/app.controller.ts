import { Controller, Get, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller()
export class AppController {
  @Inject() configService: ConfigService

  @Get()
  config() {
    return this.configService.get('app')
  }
}
