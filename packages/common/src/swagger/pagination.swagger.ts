import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

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
