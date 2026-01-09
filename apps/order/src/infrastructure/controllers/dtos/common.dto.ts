import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../entities/common.entity';

export function ApiController(apiTag: string) {
  return applyDecorators(ApiTags(apiTag), ApiBearerAuth());
}

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
      description: 'Not Found. Either due to invalid URL or invalid id',
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

export function ApiQueryPagination(defaultPage = 1, defaultPageSize = 10) {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      default: defaultPage,
      type: 'number',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      default: defaultPageSize,
      type: 'number',
    }),
  );
}
