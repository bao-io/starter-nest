import { prop } from '@typegoose/typegoose';
import { isEmail, isMobilePhone } from 'class-validator';
import { BaseModel, getProviderByTypegooseClass } from 'src/framework';

export enum UserRole {
  ADMIN,
  USER,
}

export enum UserStatus {
  DISABLE,
  ENABLE,
}

export class User extends BaseModel {
  @prop()
  nickname?: string;

  @prop()
  headimgurl?: string;

  @prop({ type: [Number], enum: UserRole, default: [UserRole.USER] })
  roles?: UserRole[];

  @prop({
    validate: (val) => isMobilePhone(val, 'zh-CN'),
  })
  phone?: string;

  @prop({ validate: isEmail })
  email?: string;

  @prop({ enum: UserStatus, default: UserStatus.ENABLE })
  status?: number;
}

export const UserProvider = getProviderByTypegooseClass(User);
