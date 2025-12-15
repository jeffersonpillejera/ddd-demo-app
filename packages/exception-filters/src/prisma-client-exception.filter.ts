import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { inspect } from 'util';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    Logger.error(inspect(exception));

    switch (exception.code) {
      case 'P2002':
        response
          .status(HttpStatus.CONFLICT)
          .json({
            statusCode: HttpStatus.CONFLICT,
            message:
              'Unique constraint failed on the fields: ' +
              (exception.meta?.target as string[]).join(', '),
            error: exception.message,
          });
        break;
      // Add more cases for other Prisma error codes as needed
      default:
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          });
    }
  }
}
