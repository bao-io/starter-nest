import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { __DEV__ } from 'src/app.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    Logger.error(
      `interface: \'${request.url}\' error, message: ${exception.message}`,
      __DEV__ && exception.stack ? exception.stack : void 0,
      'HttpExceptionFilter',
    );
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (exception as any).response?.message || exception.message,
      stack: __DEV__ && exception.stack ? exception.stack : void 0,
    });
  }
}
