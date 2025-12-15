import { CustomerDTO } from '../../application/dtos/customer.dto';
import { Customer } from '../../domain/models/customer';
import { IPresenter } from '@ecore/domain/core/presenter';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class CustomerPresenter implements IPresenter<Customer, CustomerDTO> {
  toDTO(domain: Customer): CustomerDTO {
    return {
      id: domain.id.toString(),
      email: domain.email.value,
      firstName: domain.firstName,
      lastName: domain.lastName,
      mobileNumber: domain.mobileNumber,
      creditLimit: domain.creditLimit.props,
      addresses:
        domain.addresses?.map((address) => ({
          label: address.props.label,
          street1: address.props.street1,
          street2: address.props.street2 ?? undefined,
          city: address.props.city,
          province: address.props.province,
          zip: address.props.zip,
          country: address.props.country,
          type: address.props.type,
        })) ?? [],
    };
  }

  notFound(id?: string) {
    throw new NotFoundException(
      id ? `Customer with id ${id} not found` : 'Customer not found',
    );
  }

  unauthorized() {
    throw new UnauthorizedException('Unauthorized');
  }

  forbidden() {
    throw new ForbiddenException(
      'You are not authorized to access this resource',
    );
  }

  badRequest(error: Error) {
    throw new BadRequestException(error.message);
  }

  internalServerError(error: Error) {
    throw new InternalServerErrorException(error.message);
  }

  unprocessable(error: Error) {
    throw new UnprocessableEntityException(error.message);
  }
}
