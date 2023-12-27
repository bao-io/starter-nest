import { ConfigModule } from '@nestjs/config'
import configuration from '../app.config'

export const config = ConfigModule.forRoot({
  envFilePath: [
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.local',
    '.env',
  ],
  load: [configuration],
  isGlobal: true,
})
