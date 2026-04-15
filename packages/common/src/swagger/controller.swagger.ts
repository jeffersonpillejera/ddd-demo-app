import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiController(apiTag: string) {
  return applyDecorators(ApiTags(apiTag), ApiBearerAuth());
}
