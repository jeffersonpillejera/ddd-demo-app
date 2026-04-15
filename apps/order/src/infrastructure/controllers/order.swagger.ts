import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiCommonErrorResponses } from '@ecore/common/swagger/error-response.swagger';
import { OrderDTO, PlaceOrderDTO } from '../presenters/order.dto';

export function ApiGetOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Get an order' }),
    ApiParam({
      name: 'id',
      description: 'The id of the order',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: 'The order has been found',
      type: OrderDTO,
    }),
    ApiCommonErrorResponses(),
  );
}

export function ApiPlaceOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Place an order' }),
    ApiBody({ type: PlaceOrderDTO }),
    ApiResponse({ status: 201, description: 'The order has been placed' }),
    ApiCommonErrorResponses(),
  );
}
