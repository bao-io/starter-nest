import { Provider } from '@nestjs/common';
import { ClientSession, Connection } from 'mongoose';
import { DB_CONNECTION_TOKEN, DB_TRANSACTION_TOKEN } from 'src/constant';

export class TransactionHelper {
  constructor(private connection: Connection) {}
  async startTransaction(): Promise<ClientSession> {
    const session: ClientSession = await this.connection.startSession();
    await session.startTransaction();
    return session;
  }

  async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    await session.endSession();
  }

  async rollbackTransaction(session: ClientSession) {
    await session.abortTransaction();
    await session.endSession();
  }
}

export const TransactionProvider = {
  provide: DB_TRANSACTION_TOKEN,
  inject: [DB_CONNECTION_TOKEN],
  useFactory: async (connection: Connection) => {
    return new TransactionHelper(connection);
  },
} as Provider;
