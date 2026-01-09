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
import { ApiController } from './dtos/common.dto';
import {
  ApiGetCustomer,
  CreateCustomerDTO,
  ApiCreateCustomer,
} from './dtos/customer.dto';
import { Customer } from './entities/customer.entity';
import { CreateCustomerCommand } from '../../application/commands/create-customer.command';
import type { Request } from 'express';
import { GetCustomerQuery } from '../../application/queries/get-customer.query';

@ApiController('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(ApplicationProxyModule.CREATE_CUSTOMER_COMMAND)
    private readonly createCustomerCommand: CreateCustomerCommand,
    @Inject(ApplicationProxyModule.GET_CUSTOMER_QUERY)
    private readonly getCustomerQuery: GetCustomerQuery,
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
}
