import { Entity } from '@ecore/domain/core/entity';
import { UniqueIdentifier } from '@ecore/domain/core/unique-identifier';
import { Password } from '@ecore/domain/common/value-objects/password';
import { IpAddress } from '@ecore/domain/common/value-objects/ip-address';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/domain/common/exceptions';

export interface UserProps {
  requiredLogin?: boolean | null;
  failedLoginAttempts?: number | null;
  isActive?: boolean | null;
  dateConfirmed?: Date | null;
  password: Password;
  lastIpAddress: IpAddress | null;
  lastLoginDate?: Date | null;
  lastActivityDate?: Date | null;
  lastPasswordChangeDate?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  get requiredLogin(): boolean | null | undefined {
    return this.props.requiredLogin;
  }
  get failedLoginAttempts(): number | null | undefined {
    return this.props.failedLoginAttempts;
  }
  get isActive(): boolean | null | undefined {
    return this.props.isActive;
  }
  get dateConfirmed(): Date | null | undefined {
    return this.props.dateConfirmed;
  }
  get password(): Password {
    return this.props.password;
  }
  get lastIpAddress(): IpAddress | null {
    return this.props.lastIpAddress;
  }
  get lastLoginDate(): Date | null | undefined {
    return this.props.lastLoginDate;
  }
  get lastActivityDate(): Date | null | undefined {
    return this.props.lastActivityDate;
  }
  get lastPasswordChangeDate(): Date | null | undefined {
    return this.props.lastPasswordChangeDate;
  }
  get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public static create(
    {
      requiredLogin,
      failedLoginAttempts,
      isActive,
      dateConfirmed,
      password,
      lastIpAddress,
      lastLoginDate,
      lastActivityDate,
      lastPasswordChangeDate,
      createdAt,
      updatedAt,
    }: UserProps,
    id?: UniqueIdentifier,
  ): User {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (!lastIpAddress) {
      throw new UnprocessableException('Last IP address is required');
    }
    return new User(
      {
        requiredLogin:
          typeof requiredLogin === 'boolean' ? requiredLogin : false,
        failedLoginAttempts:
          typeof failedLoginAttempts === 'number' && failedLoginAttempts > 0
            ? failedLoginAttempts
            : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        dateConfirmed,
        password,
        lastIpAddress,
        lastLoginDate,
        lastActivityDate,
        lastPasswordChangeDate,
        createdAt: createdAt ?? new Date(),
        updatedAt,
      },
      id,
    );
  }

  public signIn(password: string): void {
    if (!this.props.isActive) {
      throw new BadRequestException(
        'User is not active. Please contact support.',
      );
    }

    if (!this.props.dateConfirmed) {
      throw new UnprocessableException(
        'User is not yet confirmed. Please confirm your email address. You will be unable to login until you confirm your email address.',
      );
    }

    if (!this.props.password.verifyPassword(password)) {
      this.props.failedLoginAttempts = this.props.failedLoginAttempts
        ? this.props.failedLoginAttempts + 1
        : 1;
      if (this.props.failedLoginAttempts >= 3) {
        this.props.isActive = false;
      }
      throw new BadRequestException('Invalid password');
    }

    this.props.failedLoginAttempts = 0;
    this.props.lastLoginDate = new Date();
    this.props.lastActivityDate = new Date();
  }
}
