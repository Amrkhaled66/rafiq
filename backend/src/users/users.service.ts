import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ListUsersScope,
  UserInsert,
  UserRow,
  UsersRepository,
} from './users.repository';

type PublicUser = Omit<UserRow, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async findActiveUserById(id: number): Promise<UserRow> {
    const user = await this.usersRepository.findActiveById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findActiveUserByPhone(phone: string): Promise<UserRow> {
    const user = await this.usersRepository.findActiveByPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getMe(userId: number): Promise<PublicUser> {
    const user = await this.findActiveUserById(userId);
    return this.toPublicUser(user);
  }

  async getUserById(id: number): Promise<PublicUser> {
    const user = await this.findUserByIdOrThrow(id);
    return this.toPublicUser(user);
  }

  // async listUsers(user: AuthenticatedUser, query: ListUsersQueryDto) {
  //   const scope = this.resolveListUsersScope(user);
  //   const result = await this.usersRepository.list(query, scope);

  //   return {
  //     data: result.items.map((item) => this.toPublicUser(item)),
  //     page: result.page,
  //     limit: result.limit,
  //     total: result.total,
  //   };
  // }

  async createUser(dto: CreateUserDto): Promise<PublicUser> {
    await this.ensurePhoneAvailable(dto.phone);

    const hashedPassword = await this.authService.hashPassword(dto.password);

    const createdUser = await this.usersRepository.create({
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        password: hashedPassword,
        role: dto.role,
      });

    return this.toPublicUser(createdUser);
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    actor: AuthenticatedUser,
  ): Promise<PublicUser> {
    const existingUser = await this.findUserByIdOrThrow(id);

    if (actor.role === 'coach') {
      if (dto.role !== undefined) {
        throw new ForbiddenException('Coaches cannot change user roles');
      }

      if (existingUser.role !== 'student') {
        throw new ForbiddenException('Coaches can only edit student accounts');
      }
    }

    if (dto.phone) {
      await this.ensurePhoneAvailable(dto.phone, id);
    }

    const updatePayload: Partial<UserInsert> = {
      updatedAt: new Date(),
    };

    if (dto.fullName !== undefined) {
      updatePayload.fullName = dto.fullName.trim();
    }

    if (dto.phone !== undefined) {
      updatePayload.phone = dto.phone.trim();
    }

    if (dto.role !== undefined) {
      updatePayload.role = dto.role;
    }

    const updatedUser = await this.usersRepository.updateById(id, updatePayload);

    return this.toPublicUser(updatedUser);
  }

  async softDeleteUser(id: number): Promise<void> {
    const existingUser = await this.findUserByIdOrThrow(id);

    if (existingUser.deletedAt) {
      return;
    }

    await this.usersRepository.softDeleteById(id);
  }

  private async findUserByIdOrThrow(id: number): Promise<UserRow> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async ensurePhoneAvailable(
    phone: string,
    excludedUserId?: number,
  ): Promise<void> {
    const normalizedPhone = phone.trim();
    const existingUser = await this.usersRepository.findByPhoneExcludingUser(
      normalizedPhone,
      excludedUserId,
    );

    if (existingUser) {
      throw new ConflictException('Phone is already in use');
    }
  }

  private toPublicUser(user: UserRow): PublicUser {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  // private resolveListUsersScope(user: AuthenticatedUser): ListUsersScope {
  //   if (user.role === 'super_admin') {
  //     return { type: 'all' };
  //   }

  //   if (user.role === 'coach') {
  //     return {
  //       coachId: user.sub,
  //       type: 'assigned_students',
  //     };
  //   }

  //   throw new ForbiddenException('You are not allowed to list users');
  // }
}
