import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApplicationProxyModule } from '../application-proxy.module';
import { Inject } from '@nestjs/common';
import { ApiController, OrderPlacedEventDTO } from './dtos/common.dto';
import {
  ApiGetCustomer,
  CreateCustomerDTO,
  ApiCreateCustomer,
} from './dtos/customer.dto';
import { Customer } from './entities/customer.entity';
import { CreateCustomerCommand } from '../../application/commands/create-customer.command';
import type { Request } from 'express';
import { GetCustomerQuery } from '../../application/queries/get-customer.query';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreditPurchaseCommand } from '../../application/commands/credit-purchase.command';

@ApiController('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(ApplicationProxyModule.CREATE_CUSTOMER_COMMAND)
    private readonly createCustomerCommand: CreateCustomerCommand,
    @Inject(ApplicationProxyModule.GET_CUSTOMER_QUERY)
    private readonly getCustomerQuery: GetCustomerQuery,
    @Inject(ApplicationProxyModule.CREDIT_PURCHASE_COMMAND)
    private readonly creditPurchaseCommand: CreditPurchaseCommand,
  ) {}

  @Post()
  @ApiCreateCustomer()
  async createCustomer(
    @Body() createCustomerDTO: CreateCustomerDTO,
    @Req() request: Request,
  ) {
    return this.createCustomerCommand.execute({
      ...createCustomerDTO,
      lastIpAddress: request.ip!,
    });
  }

  @Get(':id')
  @ApiGetCustomer()
  async getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Customer | void> {
    return this.getCustomerQuery.execute({ id });
  }

  @EventPattern('OrderPlacedEvent')
  async handleOrderPlaced(@Payload() data: OrderPlacedEventDTO): Promise<void> {
    return this.creditPurchaseCommand.execute({
      customerId: data.customerId,
      orderId: data.orderId,
      grandTotal: data.grandTotal,
    });
  }
}
