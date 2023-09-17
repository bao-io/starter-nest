import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  RequestMethod,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { __DEV__ } from 'src/app.config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  @Inject() private configSerivce: ConfigService;

  use(request: Request, response: Response, next) {
    const app = this.configSerivce.get('app');
    const getMethod = (method) => RequestMethod[method];
    const origins = request.headers.origin;
    const origin = (Array.isArray(origins) ? origins[0] : origins) || '';

    const allowedOrigins = [...app.allowedOrigins];
    const allowedMethods = [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.PUT,
      RequestMethod.PATCH,
      RequestMethod.POST,
      RequestMethod.DELETE,
    ];
    const allowedHeaders = [
      'Authorization',
      'Origin',
      'No-Cache',
      'X-Requested-With',
      'If-Modified-Since',
      'Pragma',
      'Last-Modified',
      'last-event-id',
      'Cache-Control',
      'Expires',
      'Content-Type',
      'X-E4M-With',
    ];

    // Allow Origin
    if (!origin || allowedOrigins.includes(origin) || __DEV__) {
      response.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    // Headers
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
    response.header(
      'Access-Control-Allow-Methods',
      allowedMethods.map(getMethod).join(','),
    );
    response.header('Access-Control-Max-Age', '1728000');
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.header('X-Powered-By', `${app.name}`);

    // OPTIONS Request
    if (request.method === getMethod(RequestMethod.OPTIONS)) {
      return response.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return next();
    }
  }
}
