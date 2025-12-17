import { CustomerDTO } from '../../application/dtos/customer.dto';
import { Customer } from '../../domain/models/customer';
import { IPresenter } from '@ecore/domain/core/presenter';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

  notFound(message?: string) {
    throw new NotFoundException(message ?? 'Entity not found');
  }

  unauthorized(message?: string) {
    throw new UnauthorizedException(message ?? 'Unauthorized');
  }

  forbidden(message?: string) {
    throw new ForbiddenException(message ?? 'Forbidden');
  }

  badRequest(message?: string) {
    throw new BadRequestException(message ?? 'Bad Request');
  }

  unprocessable(message?: string) {
    throw new UnprocessableEntityException(message ?? 'Unprocessable Entity');
  }
}
