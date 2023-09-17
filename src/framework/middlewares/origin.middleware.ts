import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __DEV__ } from 'src/app.config';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  @Inject() private configSerivce: ConfigService;
  use(request: Request, response: Response, next) {
    // production only
    if (!__DEV__) {
      const { origin, referer } = request.headers;
      const isAllowed = (field) =>
        !field || field.includes(this.configSerivce.get('app.domain'));
      const isAllowedOrigin = isAllowed(origin);
      const isAllowedReferer = isAllowed(referer);
      if (!isAllowedOrigin && !isAllowedReferer) {
        throw new UnauthorizedException();
      }
    }

    return next();
  }
}
