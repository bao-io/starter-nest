import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type, data }: ArgumentMetadata) {
    if (type === 'query' && this.isJsType(metatype) && !value) {
      throw new BadRequestException(`query parameter \`${data}\` is required`);
    }
    if (!metatype || this.isJsType(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let errMsgs: string[] = [];
      const pushMessage = (constraints = {}) => {
        errMsgs.push(...Object.values<any>(constraints));
      };
      errors.forEach((error) => {
        if (error.constraints) {
          pushMessage(error.constraints);
        }
        if (error.children) {
          error.children.forEach((e) => pushMessage(e.constraints));
        }
      });
      throw new BadRequestException(errMsgs);
    }
    return value;
  }

  private isJsType(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}
