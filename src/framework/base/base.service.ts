import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { MongooseModel, TypegooseClass } from '../database/database.model';
import { BaseModel } from './base.model';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { DocumentType } from '@typegoose/typegoose';

export class PageParam<T extends TypegooseClass> {
  @IsNotEmpty()
  @IsNumber()
  size: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  current: number;
  filter?: FilterQuery<T>;
  projection?: ProjectionType<T>;
  options?: QueryOptions<T>;
}

export interface PageResult<T extends TypegooseClass> extends PageParam<T> {
  records: DocumentType<T>;
  total: number;
}

export class BaseServiceImpl<T extends TypegooseClass> {
  constructor(private model: MongooseModel<T>) {}

  update(filter: FilterQuery<T>, update: UpdateQuery<any>) {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async findByIdAndUpdate(update: UpdateQuery<any>) {
    return this.model.findByIdAndUpdate(
      new Types.ObjectId(update._id),
      update,
      {
        upsert: true,
        new: true,
      },
    );
  }

  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<any>,
    projection?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      ...projection,
    });
  }

  findById(id: BaseModel['_id']) {
    return this.model.findById(id);
  }

  deleteById(id: BaseModel['_id']) {
    return this.model.findByIdAndRemove(id);
  }
}
