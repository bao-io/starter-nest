import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { DB_CONNECTION_TOKEN } from 'src/constant';

export const DataBaseProvider = {
  provide: DB_CONNECTION_TOKEN,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    let reconnectionTask: NodeJS.Timeout | null = null;
    const RECONNECT_INTERVAL = 5000;

    const connection = () => {
      return mongoose.connect(
        'mongodb://localhost:27017',
        configService.get('mongo'),
      );
    };

    mongoose.set('strictQuery', false);

    mongoose.connection.on('connecting', () => {
      Logger.log('mongodb connecting...', 'DataBaseProvider');
    });

    mongoose.connection.on('open', () => {
      Logger.log('mongodb successfully connect', 'DataBaseProvider');
      if (reconnectionTask) {
        clearTimeout(reconnectionTask);
        reconnectionTask = null;
      }
    });

    mongoose.connection.on('disconnected', () => {
      Logger.log(
        `mongodb disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`,
        'DataBaseProvider',
      );
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (error) => {
      Logger.error(`mongodb error: ${error}`, 'DataBaseProvider');
      mongoose.disconnect();
    });

    return await connection();
  },
} as Provider;
