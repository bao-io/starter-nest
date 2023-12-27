import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  return app
    .listen(AppModule.port)
}

bootstrap().then(() => {
  Logger.log(
    `Application running on http://localhost:${AppModule.port}`,
    'MainApplication',
  )
})
