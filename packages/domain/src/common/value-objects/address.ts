import { ValueObject, ValueObjectProps } from '../../core/value-object';

export enum AddressTypeEnum {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export enum CountryCodeEnum {
  US = 'US',
  PH = 'PH',
}

export interface IAddressProps extends ValueObjectProps {
  label: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  zip: string;
  country: CountryCodeEnum;
  type: AddressTypeEnum;
}

export class Address extends ValueObject<IAddressProps> {
  private constructor(props: IAddressProps) {
    super(props);
  }

  get value(): IAddressProps {
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
  }: IAddressProps): Address {
    if (!label || label.trim() === '') {
      throw new Error('Label must be a non-empty string');
    }
    if (!street1 || street1.trim() === '') {
      throw new Error('Street 1 must be a non-empty string');
    }
    if (!city || city.trim() === '') {
      throw new Error('City must be a non-empty string');
    }
    if (!province || province.trim() === '') {
      throw new Error('Province must be a non-empty string');
    }
    if (!zip || zip.trim() === '') {
      throw new Error('Zip must be a non-empty string');
    }
    if (!type || !Object.values(AddressTypeEnum).includes(type)) {
      throw new Error('Type must be a valid address type');
    }
    if (!country || !Object.values(CountryCodeEnum).includes(country)) {
      throw new Error('Country must be a valid country code');
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
