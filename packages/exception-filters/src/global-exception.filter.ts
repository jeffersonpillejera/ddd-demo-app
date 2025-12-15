import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface HttpExceptionResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface ErrorWithStatus extends Error {
  status?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : ((exception as ErrorWithStatus).status ??
          HttpStatus.INTERNAL_SERVER_ERROR);

    let errorMessage = 'Internal server error';
    let errorDetails: string | null = null;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        errorMessage = response;
      } else {
        const responseObj = response as HttpExceptionResponse;
        errorMessage = responseObj.message ?? 'Internal server error';
        errorDetails = responseObj.error ?? null;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      errorDetails = exception.stack ?? null;
    }

    const requestUrl = httpAdapter.getRequestUrl(ctx.getRequest()) as string;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: errorMessage,
    };

    const logData = { ...responseBody, errorDetails };
    this.logger.error(`Exception: ${JSON.stringify(logData)}`);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
