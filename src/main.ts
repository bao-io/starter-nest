import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  return app
    .listen(9000)
}

bootstrap().then(() => {
  Logger.log(
    `Application running on http://localhost:9000`,
    'MainApplication',
  )
})
