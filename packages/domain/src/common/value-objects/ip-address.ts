import { ValueObject, ValueObjectProps } from '../../core/value-object';
import { isIPv4, isIPv6, isIP } from 'net';

export interface IIpAddressProps extends ValueObjectProps {
  value: string;
}

export class IpAddress extends ValueObject<IIpAddressProps> {
  private constructor(props: IIpAddressProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): IpAddress {
    if (!isIPv4(value) && !isIPv6(value) && isIP(value) === 0) {
      throw new Error('Invalid IP address');
    }
    return new IpAddress({ value });
  }
}
