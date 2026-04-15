import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PlaceOrderCommand } from '../../application/commands/place-order/place-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order/cancel-order.command';
import { ConfirmOrderCommand } from '../../application/commands/confirm-order/confirm-order.command';
import { ApiGetOrder, ApiPlaceOrder } from './order.swagger';
import { PlaceOrderDTO } from '../presenters/order.dto';
import {
  CreditPurchaseApprovedEventDTO,
  CreditPurchaseRejectedEventDTO,
} from '@ecore/common/dto/customer.dto';
import { GetOrderQuery } from '../../application/queries/get-order/get-order.query';
import { OrderDTO } from '../presenters/order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiController } from '@ecore/common/swagger/controller.swagger';

@ApiController('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiGetOrder()
  async getOrder(@Param('id') id: string): Promise<OrderDTO> {
    return this.queryBus.execute<GetOrderQuery, OrderDTO>(
      new GetOrderQuery(id),
    );
  }

  @Post('place')
  @ApiPlaceOrder()
  async placeOrder(@Body() placeOrderDTO: PlaceOrderDTO) {
    return this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(placeOrderDTO),
    );
  }

  @Patch('cancel/:id')
  async cancelOrder(@Param('id') id: string) {
    return this.commandBus.execute<CancelOrderCommand, void>(
      new CancelOrderCommand(id),
    );
  }

  @EventPattern('CreditPurchaseApprovedEvent')
  async handleCreditPurchaseApproved(
    @Payload() data: CreditPurchaseApprovedEventDTO,
  ): Promise<void> {
    return this.commandBus.execute<ConfirmOrderCommand, void>(
      new ConfirmOrderCommand(data.orderId),
    );
  }

  @EventPattern('CreditPurchaseRejectedEvent')
  async handleCreditPurchaseRejected(
    @Payload() data: CreditPurchaseRejectedEventDTO,
  ): Promise<void> {
    return this.commandBus.execute<CancelOrderCommand, void>(
      new CancelOrderCommand(data.orderId),
    );
  }
}
