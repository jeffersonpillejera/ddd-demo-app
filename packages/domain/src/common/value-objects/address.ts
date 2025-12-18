import { ValueObject, ValueObjectProps } from '../../core/value-object';
import { BadRequestException } from '../../common/exceptions';

export enum AddressTypeEnum {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export enum CountryCodeEnum {
  US = 'US',
  PH = 'PH',
}

export interface AddressProps extends ValueObjectProps {
  label: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  zip: string;
  country: CountryCodeEnum;
  type: AddressTypeEnum;
}

export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  }

  get value(): AddressProps {
    return this.props;
  }

  public static create({
    country,
    type,
    label,
    street1,
    street2,
    city,
    province,
    zip,
  }: AddressProps): Address {
    if (!label || label.trim() === '') {
      throw new BadRequestException('Label must be a non-empty string');
    }
    if (!street1 || street1.trim() === '') {
      throw new BadRequestException('Street 1 must be a non-empty string');
    }
    if (!city || city.trim() === '') {
      throw new BadRequestException('City must be a non-empty string');
    }
    if (!province || province.trim() === '') {
      throw new BadRequestException('Province must be a non-empty string');
    }
    if (!zip || zip.trim() === '') {
      throw new BadRequestException('Zip must be a non-empty string');
    }
    if (!type || !Object.values(AddressTypeEnum).includes(type)) {
      throw new BadRequestException('Type must be a valid address type');
    }
    if (!country || !Object.values(CountryCodeEnum).includes(country)) {
      throw new BadRequestException('Country must be a valid country code');
    }
    return new Address({
      country,
      type,
      label,
      street1,
      street2,
      city,
      province,
      zip,
    });
  }
}
