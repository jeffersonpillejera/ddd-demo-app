import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiController, OrderPlacedEventDTO } from './dtos/common.dto';
import {
  ApiGetCustomer,
  CreateCustomerDTO,
  ApiCreateCustomer,
} from './dtos/customer.dto';
import { Customer } from './entities/customer.entity';
import { CreateCustomerCommand } from '../../application/commands/create-customer/create-customer.command';
import type { Request } from 'express';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreditPurchaseCommand } from '../../application/commands/credit-purchase/credit-purchase.command';
import { GetCustomerQuery } from '../../application/queries/get-customer/get-customer.query';
import { CustomerDTO } from '../../application/dtos/customer.dto';

@ApiController('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiCreateCustomer()
  async createCustomer(
    @Body() createCustomerDTO: CreateCustomerDTO,
    @Req() request: Request,
  ) {
    return this.commandBus.execute<CreateCustomerCommand, Promise<void>>(
      new CreateCustomerCommand({
        ...createCustomerDTO,
        lastIpAddress: request.ip!,
      }),
    );
  }

  @Get(':id')
  @ApiGetCustomer()
  async getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Customer | void> {
    return this.queryBus.execute<GetCustomerQuery, CustomerDTO>(
      new GetCustomerQuery(id),
    );
  }

  @EventPattern('OrderPlacedEvent')
  async handleOrderPlaced(
    @Payload() { customerId, orderId, grandTotal }: OrderPlacedEventDTO,
  ): Promise<void> {
    return this.commandBus.execute<CreditPurchaseCommand, Promise<void>>(
      new CreditPurchaseCommand({ customerId, orderId, grandTotal }),
    );
  }
}
