import { Module, Global } from '@nestjs/common';
import { DataBaseProvider } from './database.provider';
import {
  TransactionProvider,
  TransactionHelper,
} from './database.transaction.provider';

@Global()
@Module({
  providers: [DataBaseProvider, TransactionProvider],
  exports: [DataBaseProvider, TransactionProvider],
})
export class DatabaseModule {}
export { TransactionHelper };
export * from './database.model';
