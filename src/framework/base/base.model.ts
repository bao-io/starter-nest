import { ModelOptions, Severity } from '@typegoose/typegoose';
import { RefType, Types } from 'mongoose';

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
