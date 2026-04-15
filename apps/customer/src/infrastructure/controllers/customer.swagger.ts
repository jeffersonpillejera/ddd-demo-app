import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateCustomerDTO, CustomerDTO } from '../presenters/customer.dto';
import { ApiCommonErrorResponses } from '@ecore/common/swagger/error-response.swagger';

export function ApiGetCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a customer' }),
    ApiParam({
      name: 'id',
      description: 'The id of the customer',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'The customer has been found',
      type: CustomerDTO,
    }),
    ApiCommonErrorResponses(),
  );
}

export function ApiCreateCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a customer' }),
    ApiBody({ type: CreateCustomerDTO }),
    ApiResponse({
      status: 201,
      description: 'The customer has been created',
      type: CustomerDTO,
    }),
    ApiCommonErrorResponses(),
  );
}
