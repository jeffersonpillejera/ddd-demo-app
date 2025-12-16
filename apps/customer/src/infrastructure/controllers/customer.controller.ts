import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApplicationProxyModule } from '../application-proxy.module';
import { Inject } from '@nestjs/common';
import { ApiController } from './dtos/common.dto';
import { GetCustomerHandler } from '../../application/queries/get-customer/get-customer.handler';
import { GetCustomerQuery } from '../../application/queries/get-customer/get-customer.query';
import { ApiGetCustomer } from './dtos/customer.dto';
import { Customer } from './entities/customer.entity';

@ApiController('customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject(ApplicationProxyModule.GET_CUSTOMER_QUERY)
    private readonly getCustomerHandler: GetCustomerHandler,
  ) {}

  @Get(':id')
  @ApiGetCustomer()
  async getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Customer | void> {
    return this.getCustomerHandler.execute(new GetCustomerQuery(id));
  }
}
