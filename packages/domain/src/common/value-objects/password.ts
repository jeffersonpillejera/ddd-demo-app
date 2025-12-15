import { ValueObject, ValueObjectProps } from '../../core/value-object';
import * as crypto from 'crypto';

const PASSWORD_LENGTH = 256;
const MIN_PASSWORD_LENGTH = 12;
const SALT_LENGTH = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';
const BYTE_TO_STRING_ENCODING = 'base64';

export interface PasswordProps extends ValueObjectProps {
  hashedPassword: string;
  salt: string;
  iterations: number;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): PasswordProps {
    return this.props;
  }

  public static create({
    hashedPassword,
    salt,
    iterations,
  }: PasswordProps): Password {
    if (!hashedPassword || hashedPassword.trim() === '') {
      throw new Error('Password is required');
    }
    if (!salt || salt.trim() === '') {
      throw new Error('Salt is required');
    }
    if (!iterations || isNaN(iterations)) {
      throw new Error('Iterations must be a number');
    }
    if (iterations <= 0) {
      throw new Error('Iterations must be greater than 0');
    }
    return new Password({ hashedPassword, salt, iterations });
  }

  public static validateAndHashPassword(password: string): Password {
    if (!password || password.trim() === '') {
      throw new Error('Password is required');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters long',
      );
    }

    if (password.length > PASSWORD_LENGTH) {
      throw new Error(
        'Password must be less than ' + PASSWORD_LENGTH + ' characters long',
      );
    }

    if (new RegExp('^(?=.*[A-Z]).+$').test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (new RegExp('^(?=.*[a-z]).+$').test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (new RegExp('^(?=.*[0-9]).+$').test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (new RegExp('^(?=.*[!@#$%^&*]).+$').test(password)) {
      throw new Error('Password must contain at least one special character');
    }

    const salt = crypto
      .randomBytes(SALT_LENGTH)
      .toString(BYTE_TO_STRING_ENCODING);

    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST)
      .toString(BYTE_TO_STRING_ENCODING);

    return new Password({ hashedPassword, salt, iterations: ITERATIONS });
  }

  public verifyPassword(password: string): boolean {
    return (
      crypto
        .pbkdf2Sync(
          password,
          this.props.salt,
          this.props.iterations,
          PASSWORD_LENGTH,
          DIGEST,
        )
        .toString(BYTE_TO_STRING_ENCODING) === this.props.hashedPassword
    );
  }
}
