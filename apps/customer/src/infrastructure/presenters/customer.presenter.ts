import { ICustomerDTO } from '../../application/dto.interface';
import { Customer } from '../../domain/models/customer';
import { Presenter } from '@ecore/core/presenter';
import { Injectable } from '@nestjs/common';
import { CustomerDTO } from './customer.dto';

@Injectable()
export class CustomerPresenter implements Presenter<Customer, ICustomerDTO> {
  toDTO(domain: Customer): ICustomerDTO {
    return new CustomerDTO(domain);
  }
}
