import { User, UserProps } from './user';
import { UniqueIdentifier } from '@ecore/core/unique-identifier';
import { Password } from '@ecore/core/common/value-objects/password';
import { IpAddress } from '@ecore/core/common/value-objects/ip-address';
import {
  BadRequestException,
  UnprocessableException,
} from '@ecore/core/common/exceptions';

describe('User', () => {
  let mockPassword: Password;
  let mockIpAddress: IpAddress;
  let validPassword: string;
  let validProps: UserProps;

  beforeEach(() => {
    validPassword = 'ValidPassword123!';
    mockPassword = Password.validateAndHashPassword(validPassword);
    mockIpAddress = IpAddress.create('192.168.1.1');

    validProps = {
      password: mockPassword,
      lastIpAddress: mockIpAddress,
      isActive: true,
      dateConfirmed: new Date(),
      requiredLogin: false,
      failedLoginAttempts: 0,
      lastLoginDate: undefined,
      lastActivityDate: undefined,
      lastPasswordChangeDate: undefined,
    };
  });

  describe('create', () => {
    it('should create a user with all required properties', () => {
      const user = User.create(validProps);

      expect(user).toBeInstanceOf(User);
      expect(user.password).toBe(mockPassword);
      expect(user.lastIpAddress).toBe(mockIpAddress);
      expect(user.isActive).toBe(true);
      expect(user.dateConfirmed).toBeInstanceOf(Date);
      expect(user.requiredLogin).toBe(false);
      expect(user.failedLoginAttempts).toBe(0);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should create a user with all optional properties', () => {
      const lastLoginDate = new Date('2023-01-01');
      const lastActivityDate = new Date('2023-01-02');
      const lastPasswordChangeDate = new Date('2023-01-03');
      const dateConfirmed = new Date('2023-01-04');
      const createdAt = new Date('2023-01-05');
      const updatedAt = new Date('2023-01-06');

      const propsWithAllOptionals: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        requiredLogin: true,
        failedLoginAttempts: 2,
        isActive: false,
        dateConfirmed,
        lastLoginDate,
        lastActivityDate,
        lastPasswordChangeDate,
        createdAt,
        updatedAt,
      };

      const user = User.create(propsWithAllOptionals);

      expect(user.requiredLogin).toBe(true);
      expect(user.failedLoginAttempts).toBe(2);
      expect(user.isActive).toBe(false);
      expect(user.dateConfirmed).toBe(dateConfirmed);
      expect(user.lastLoginDate).toBe(lastLoginDate);
      expect(user.lastActivityDate).toBe(lastActivityDate);
      expect(user.lastPasswordChangeDate).toBe(lastPasswordChangeDate);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should create a user with provided id', () => {
      const id = new UniqueIdentifier();
      const user = User.create(validProps, id);

      expect(user.id).toBe(id);
    });

    it('should default requiredLogin to false when not provided', () => {
      const propsWithoutRequiredLogin: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
      };

      const user = User.create(propsWithoutRequiredLogin);

      expect(user.requiredLogin).toBe(false);
    });

    it('should default requiredLogin to false when null', () => {
      const propsWithNullRequiredLogin: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        requiredLogin: null,
      };

      const user = User.create(propsWithNullRequiredLogin);

      expect(user.requiredLogin).toBe(false);
    });

    it('should default requiredLogin to false when undefined', () => {
      const propsWithUndefinedRequiredLogin: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        requiredLogin: undefined,
      };

      const user = User.create(propsWithUndefinedRequiredLogin);

      expect(user.requiredLogin).toBe(false);
    });

    it('should set requiredLogin to true when provided as true', () => {
      const propsWithRequiredLogin: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        requiredLogin: true,
      };

      const user = User.create(propsWithRequiredLogin);

      expect(user.requiredLogin).toBe(true);
    });

    it('should default failedLoginAttempts to 0 when not provided', () => {
      const propsWithoutFailedAttempts: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
      };

      const user = User.create(propsWithoutFailedAttempts);

      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should default failedLoginAttempts to 0 when null', () => {
      const propsWithNullFailedAttempts: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        failedLoginAttempts: null,
      };

      const user = User.create(propsWithNullFailedAttempts);

      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should default failedLoginAttempts to 0 when undefined', () => {
      const propsWithUndefinedFailedAttempts: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        failedLoginAttempts: undefined,
      };

      const user = User.create(propsWithUndefinedFailedAttempts);

      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should default failedLoginAttempts to 0 when negative', () => {
      const propsWithNegativeFailedAttempts: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        failedLoginAttempts: -1,
      };

      const user = User.create(propsWithNegativeFailedAttempts);

      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should set failedLoginAttempts when provided as positive number', () => {
      const propsWithFailedAttempts: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        failedLoginAttempts: 2,
      };

      const user = User.create(propsWithFailedAttempts);

      expect(user.failedLoginAttempts).toBe(2);
    });

    it('should default isActive to true when not provided', () => {
      const propsWithoutIsActive: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
      };

      const user = User.create(propsWithoutIsActive);

      expect(user.isActive).toBe(true);
    });

    it('should default isActive to true when null', () => {
      const propsWithNullIsActive: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        isActive: null,
      };

      const user = User.create(propsWithNullIsActive);

      expect(user.isActive).toBe(true);
    });

    it('should default isActive to true when undefined', () => {
      const propsWithUndefinedIsActive: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        isActive: undefined,
      };

      const user = User.create(propsWithUndefinedIsActive);

      expect(user.isActive).toBe(true);
    });

    it('should set isActive to false when provided as false', () => {
      const propsWithIsActiveFalse: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        isActive: false,
      };

      const user = User.create(propsWithIsActiveFalse);

      expect(user.isActive).toBe(false);
    });

    it('should default createdAt to current date when not provided', () => {
      const propsWithoutCreatedAt: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
      };

      const user = User.create(propsWithoutCreatedAt);

      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should use provided createdAt when provided', () => {
      const createdAt = new Date('2023-01-01');
      const propsWithCreatedAt: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        createdAt,
      };

      const user = User.create(propsWithCreatedAt);

      expect(user.createdAt).toBe(createdAt);
    });

    it('should throw BadRequestException when password is missing', () => {
      const propsWithoutPassword = {
        password: null as unknown as Password,
        lastIpAddress: mockIpAddress,
      };

      expect(() => User.create(propsWithoutPassword)).toThrow(
        BadRequestException,
      );
      expect(() => User.create(propsWithoutPassword)).toThrow(
        'Password is required',
      );
    });

    it('should throw UnprocessableException when lastIpAddress is missing', () => {
      const propsWithoutIpAddress = {
        password: mockPassword,
        lastIpAddress: null as unknown as IpAddress,
      };

      expect(() => User.create(propsWithoutIpAddress)).toThrow(
        UnprocessableException,
      );
      expect(() => User.create(propsWithoutIpAddress)).toThrow(
        'Last IP address is required',
      );
    });
  });

  describe('getters', () => {
    it('should return requiredLogin', () => {
      const user = User.create(validProps);
      expect(user.requiredLogin).toBe(false);
    });

    it('should return failedLoginAttempts', () => {
      const user = User.create(validProps);
      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should return isActive', () => {
      const user = User.create(validProps);
      expect(user.isActive).toBe(true);
    });

    it('should return dateConfirmed', () => {
      const user = User.create(validProps);
      expect(user.dateConfirmed).toBeInstanceOf(Date);
    });

    it('should return dateConfirmed as null when not provided', () => {
      const propsWithoutDateConfirmed: UserProps = {
        password: mockPassword,
        lastIpAddress: mockIpAddress,
        dateConfirmed: null,
      };
      const user = User.create(propsWithoutDateConfirmed);
      expect(user.dateConfirmed).toBeNull();
    });

    it('should return password', () => {
      const user = User.create(validProps);
      expect(user.password).toBe(mockPassword);
    });

    it('should return lastIpAddress', () => {
      const user = User.create(validProps);
      expect(user.lastIpAddress).toBe(mockIpAddress);
    });

    it('should return lastLoginDate', () => {
      const lastLoginDate = new Date('2023-01-01');
      const propsWithLastLoginDate: UserProps = {
        ...validProps,
        lastLoginDate,
      };
      const user = User.create(propsWithLastLoginDate);
      expect(user.lastLoginDate).toBe(lastLoginDate);
    });

    it('should return lastLoginDate as undefined when not provided', () => {
      const user = User.create(validProps);
      expect(user.lastLoginDate).toBeUndefined();
    });

    it('should return lastActivityDate', () => {
      const lastActivityDate = new Date('2023-01-02');
      const propsWithLastActivityDate: UserProps = {
        ...validProps,
        lastActivityDate,
      };
      const user = User.create(propsWithLastActivityDate);
      expect(user.lastActivityDate).toBe(lastActivityDate);
    });

    it('should return lastActivityDate as undefined when not provided', () => {
      const user = User.create(validProps);
      expect(user.lastActivityDate).toBeUndefined();
    });

    it('should return lastPasswordChangeDate', () => {
      const lastPasswordChangeDate = new Date('2023-01-03');
      const propsWithLastPasswordChangeDate: UserProps = {
        ...validProps,
        lastPasswordChangeDate,
      };
      const user = User.create(propsWithLastPasswordChangeDate);
      expect(user.lastPasswordChangeDate).toBe(lastPasswordChangeDate);
    });

    it('should return lastPasswordChangeDate as undefined when not provided', () => {
      const user = User.create(validProps);
      expect(user.lastPasswordChangeDate).toBeUndefined();
    });

    it('should return createdAt', () => {
      const user = User.create(validProps);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should return createdAt as null when provided as null', () => {
      const propsWithNullCreatedAt: UserProps = {
        ...validProps,
        createdAt: null,
      };
      const user = User.create(propsWithNullCreatedAt);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      const updatedAt = new Date('2023-01-02');
      const propsWithUpdatedAt: UserProps = { ...validProps, updatedAt };
      const user = User.create(propsWithUpdatedAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should return updatedAt as undefined when not provided', () => {
      const user = User.create(validProps);
      expect(user.updatedAt).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with valid password', () => {
      const user = User.create(validProps);
      const beforeSignIn = new Date();

      user.signIn(validPassword);

      expect(user.failedLoginAttempts).toBe(0);
      expect(user.lastLoginDate).toBeInstanceOf(Date);
      expect(user.lastActivityDate).toBeInstanceOf(Date);
      expect(user.lastLoginDate!.getTime()).toBeGreaterThanOrEqual(
        beforeSignIn.getTime(),
      );
      expect(user.lastActivityDate!.getTime()).toBeGreaterThanOrEqual(
        beforeSignIn.getTime(),
      );
    });

    it('should throw BadRequestException when user is not active', () => {
      const propsInactive: UserProps = { ...validProps, isActive: false };
      const user = User.create(propsInactive);

      expect(() => user.signIn(validPassword)).toThrow(BadRequestException);
      expect(() => user.signIn(validPassword)).toThrow(
        'User is not active. Please contact support.',
      );
    });

    it('should throw UnprocessableException when user is not confirmed', () => {
      const propsUnconfirmed: UserProps = {
        ...validProps,
        dateConfirmed: null,
      };
      const user = User.create(propsUnconfirmed);

      expect(() => user.signIn(validPassword)).toThrow(UnprocessableException);
      expect(() => user.signIn(validPassword)).toThrow(
        'User is not yet confirmed. Please confirm your email address. You will be unable to login until you confirm your email address.',
      );
    });

    it('should throw BadRequestException when password is invalid', () => {
      const user = User.create(validProps);

      expect(() => user.signIn('wrongPassword')).toThrow(BadRequestException);
      expect(() => user.signIn('wrongPassword')).toThrow('Invalid password');
    });

    it('should increment failedLoginAttempts when password is invalid', () => {
      const user = User.create(validProps);
      expect(user.failedLoginAttempts).toBe(0);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.failedLoginAttempts).toBe(1);
    });

    it('should increment failedLoginAttempts from existing value when password is invalid', () => {
      const propsWithFailedAttempts: UserProps = {
        ...validProps,
        failedLoginAttempts: 1,
      };
      const user = User.create(propsWithFailedAttempts);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.failedLoginAttempts).toBe(2);
    });

    it('should set failedLoginAttempts to 1 when null and password is invalid', () => {
      const propsWithNullFailedAttempts: UserProps = {
        ...validProps,
        failedLoginAttempts: null,
      };
      const user = User.create(propsWithNullFailedAttempts);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.failedLoginAttempts).toBe(1);
    });

    it('should deactivate user when failedLoginAttempts reaches 3', () => {
      const propsWithTwoFailedAttempts: UserProps = {
        ...validProps,
        failedLoginAttempts: 2,
      };
      const user = User.create(propsWithTwoFailedAttempts);
      expect(user.isActive).toBe(true);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.failedLoginAttempts).toBe(3);
      expect(user.isActive).toBe(false);
    });

    it('should deactivate user when failedLoginAttempts exceeds 3', () => {
      const propsWithThreeFailedAttempts: UserProps = {
        ...validProps,
        failedLoginAttempts: 3,
      };
      const user = User.create(propsWithThreeFailedAttempts);
      expect(user.isActive).toBe(true);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.failedLoginAttempts).toBe(4);
      expect(user.isActive).toBe(false);
    });

    it('should reset failedLoginAttempts to 0 on successful sign in', () => {
      const propsWithFailedAttempts: UserProps = {
        ...validProps,
        failedLoginAttempts: 2,
      };
      const user = User.create(propsWithFailedAttempts);

      user.signIn(validPassword);

      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should update lastLoginDate on successful sign in', () => {
      const user = User.create(validProps);
      const beforeSignIn = Date.now();

      user.signIn(validPassword);

      expect(user.lastLoginDate).toBeInstanceOf(Date);
      expect(user.lastLoginDate!.getTime()).toBeGreaterThanOrEqual(
        beforeSignIn,
      );
    });

    it('should update lastActivityDate on successful sign in', () => {
      const user = User.create(validProps);
      const beforeSignIn = Date.now();

      user.signIn(validPassword);

      expect(user.lastActivityDate).toBeInstanceOf(Date);
      expect(user.lastActivityDate!.getTime()).toBeGreaterThanOrEqual(
        beforeSignIn,
      );
    });

    it('should not update lastLoginDate when sign in fails', () => {
      const lastLoginDate = new Date('2023-01-01');
      const propsWithLastLoginDate: UserProps = {
        ...validProps,
        lastLoginDate,
      };
      const user = User.create(propsWithLastLoginDate);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.lastLoginDate).toBe(lastLoginDate);
    });

    it('should not update lastActivityDate when sign in fails', () => {
      const lastActivityDate = new Date('2023-01-01');
      const propsWithLastActivityDate: UserProps = {
        ...validProps,
        lastActivityDate,
      };
      const user = User.create(propsWithLastActivityDate);

      try {
        user.signIn('wrongPassword');
      } catch {
        // Expected to throw
      }

      expect(user.lastActivityDate).toBe(lastActivityDate);
    });
  });
});
