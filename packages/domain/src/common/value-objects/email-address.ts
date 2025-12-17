import { ValueObject, ValueObjectProps } from '../../core/value-object';
import { BadRequestException } from '../../common/exceptions';

export interface IEmailAddressProps extends ValueObjectProps {
  value: string;
}

export class EmailAddress extends ValueObject<IEmailAddressProps> {
  private constructor(props: IEmailAddressProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: string): EmailAddress {
    if (!email?.includes('@')) {
      throw new BadRequestException('Invalid email address');
    }
    return new EmailAddress({ value: email });
  }
}
