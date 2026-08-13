import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import { UsersRepository, type UserRow } from '../users/users.repository';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const password = '123456';
  const student: UserRow = {
    id: 2,
    fullName: 'Student User',
    phone: '01000000000',
    password: 'hashed-password',
    role: 'student',
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
    updatedAt: new Date('2026-08-01T00:00:00.000Z'),
    deletedAt: null,
  };

  const usersRepository = {
    findActiveByPhone: jest.fn(),
  };
  const subscriptionsRepository = {
    hasActiveSubscription: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
  };
  const comparePassword = bcrypt.compare as jest.MockedFunction<
    typeof bcrypt.compare
  >;

  const service = new AuthService(
    usersRepository as unknown as UsersRepository,
    subscriptionsRepository as unknown as SubscriptionsRepository,
    jwtService as unknown as JwtService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepository.findActiveByPhone.mockResolvedValue(student);
    subscriptionsRepository.hasActiveSubscription.mockResolvedValue(true);
    comparePassword.mockResolvedValue(true as never);
    jwtService.signAsync.mockResolvedValue('access-token');
  });

  it('issues a token for a student with an active subscription', async () => {
    await expect(
      service.signin({ phone: ` ${student.phone} `, password }),
    ).resolves.toEqual({
      user: {
        id: student.id,
        fullName: student.fullName,
        phone: student.phone,
        role: student.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        deletedAt: student.deletedAt,
      },
      token: 'access-token',
    });

    expect(usersRepository.findActiveByPhone).toHaveBeenCalledWith(
      student.phone,
    );
    expect(subscriptionsRepository.hasActiveSubscription).toHaveBeenCalledWith(
      student.id,
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: student.id,
      role: 'student',
    });
  });

  it('rejects a student without an active subscription before signing a token', async () => {
    subscriptionsRepository.hasActiveSubscription.mockResolvedValue(false);

    await expect(
      service.signin({ phone: student.phone, password }),
    ).rejects.toEqual(new ForbiddenException('No active subscription'));

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it.each(['coach', 'super_admin'] as const)(
    'allows a %s to sign in without checking subscriptions',
    async (role) => {
      usersRepository.findActiveByPhone.mockResolvedValue({
        ...student,
        role,
      });

      await expect(
        service.signin({ phone: student.phone, password }),
      ).resolves.toMatchObject({ token: 'access-token' });

      expect(
        subscriptionsRepository.hasActiveSubscription,
      ).not.toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: student.id,
        role,
      });
    },
  );

  it('does not check subscriptions when the phone is unknown', async () => {
    usersRepository.findActiveByPhone.mockResolvedValue(undefined);

    await expect(
      service.signin({ phone: student.phone, password }),
    ).rejects.toEqual(
      new UnauthorizedException('Invalid phone or password'),
    );

    expect(comparePassword).not.toHaveBeenCalled();
    expect(
      subscriptionsRepository.hasActiveSubscription,
    ).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('does not check subscriptions when the password is invalid', async () => {
    comparePassword.mockResolvedValue(false as never);

    await expect(
      service.signin({ phone: student.phone, password }),
    ).rejects.toEqual(
      new UnauthorizedException('Invalid phone or password'),
    );

    expect(
      subscriptionsRepository.hasActiveSubscription,
    ).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
