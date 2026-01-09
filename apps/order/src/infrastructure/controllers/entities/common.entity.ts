import { ApiProperty, OmitType } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: '2025-06-09T09:19:41.462Z',
    description: 'The timestamp of the error',
  })
  timestamp: string;

  @ApiProperty({
    example: '/customer/123',
    description: 'The path of the request',
  })
  path: string;

  @ApiProperty({
    example: 'Unexpected error',
    description: 'The error message',
  })
  message: string | null;

  @ApiProperty({ example: 500, description: 'The HTTP status code' })
  statusCode: number;
}

export class BadRequestResponseDto extends OmitType(ErrorResponseDto, [
  'statusCode',
]) {
  @ApiProperty({ example: 400, description: 'The HTTP status code' })
  statusCode: number;
}

export class UnauthorizedResponseDto extends OmitType(ErrorResponseDto, [
  'statusCode',
]) {
  @ApiProperty({ example: 401, description: 'The HTTP status code' })
  statusCode: number;
}

export class ForbiddenResponseDto extends OmitType(ErrorResponseDto, [
  'statusCode',
]) {
  @ApiProperty({ example: 403, description: 'The HTTP status code' })
  statusCode: number;
}

export class NotFoundResponseDto extends OmitType(ErrorResponseDto, [
  'statusCode',
]) {
  @ApiProperty({ example: 404, description: 'The HTTP status code' })
  statusCode: number;
}
