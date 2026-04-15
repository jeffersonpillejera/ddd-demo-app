import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../dto/error-response.dto';

export function ApiCommonErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request. Input validation errors',
      type: BadRequestResponseDto,
    }),
    ApiResponse({
      status: 401,
      description:
        'Unauthorized. Usually due to missing or invalid access token',
      type: UnauthorizedResponseDto,
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Usually due to missing or invalid roles',
      type: ForbiddenResponseDto,
    }),
    ApiResponse({
      status: 404,
      description:
        'Not Found. Either due to invalid URL, invalid id or missing entity',
      type: NotFoundResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Unexpected server error',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 422,
      description: 'Unprocessable Entity. Usually due to invalid input',
    }),
  );
}
