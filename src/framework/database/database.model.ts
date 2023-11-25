import { Inject, Provider } from '@nestjs/common';
import { getModelForClass, ModelOptions, Severity } from '@typegoose/typegoose';

import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { DB_CONNECTION_TOKEN } from 'src/constant';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { RefType, Types, Connection } from 'mongoose';

export type MongooseDoc<T> = DocumentType<T>;
export type MongooseModel<T extends TypegooseClass> = ReturnModelType<T>;

export type TypegooseClass = AnyParamConstructor<BaseModel>;

@ModelOptions({
  schemaOptions: {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
  options: {
    allowMixed: Severity.WARN,
  },
})
export class BaseModel<IDType extends RefType = Types.ObjectId> {
  _id?: IDType | string;

  createdAt: Date;

  updatedAt: Date;
}

// Get Provider by Class
export function getProviderByTypegooseClass(typegooseClass: TypegooseClass) {
  return {
    provide: typegooseClass.name,
    inject: [DB_CONNECTION_TOKEN],
    useFactory: (connection: Connection) => {
      return getModelForClass(typegooseClass, {
        existingConnection: connection,
      });
    },
  } as Provider;
}

// Model injecter
export function InjectModel(model: TypegooseClass) {
  return Inject(model.name);
}
