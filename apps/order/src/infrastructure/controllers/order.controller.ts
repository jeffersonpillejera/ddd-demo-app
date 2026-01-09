import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApplicationProxyModule } from '../application-proxy.module';
import { PlaceOrderCommand } from '../../application/commands/place-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order.command';
import { ConfirmOrderCommand } from '../../application/commands/confirm-order.command';
import { ApiGetOrder, ApiPlaceOrder, PlaceOrderDTO } from './dtos/order.dto';
import { ApiController } from './dtos/common.dto';
import { GetOrderQuery } from '../../application/queries/get-order.query';
import { OrderDTO } from '../../application/dtos/order.dto';

@ApiController('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject(ApplicationProxyModule.PLACE_ORDER_COMMAND)
    private readonly placeOrderCommand: PlaceOrderCommand,
    @Inject(ApplicationProxyModule.CONFIRM_ORDER_COMMAND)
    private readonly confirmOrderCommand: ConfirmOrderCommand,
    @Inject(ApplicationProxyModule.CANCEL_ORDER_COMMAND)
    private readonly cancelOrderCommand: CancelOrderCommand,
    @Inject(ApplicationProxyModule.GET_ORDER_QUERY)
    private readonly getOrderQuery: GetOrderQuery,
  ) {}

  @Get(':id')
  @ApiGetOrder()
  async getOrder(@Param('id') id: string): Promise<OrderDTO> {
    return this.getOrderQuery.execute({ orderId: id });
  }

  @Post('place')
  @ApiPlaceOrder()
  async placeOrder(@Body() placeOrderDTO: PlaceOrderDTO) {
    return this.placeOrderCommand.execute(placeOrderDTO);
  }

  @Patch('confirm/:id')
  async confirmOrder(@Param('id') id: string) {
    return this.confirmOrderCommand.execute({ orderId: id });
  }

  @Patch('cancel/:id')
  async cancelOrder(@Param('id') id: string) {
    return this.cancelOrderCommand.execute({ orderId: id });
  }
}
