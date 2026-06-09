import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { StudentsRepository } from '../students/students.repository';
import { UsersService } from '../users/users.service';
import { CreateSubscriptionPackageDto } from './dto/create-subscription-package.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ListSubscriptionsQueryDto } from './dto/list-subscriptions-query.dto';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly usersService: UsersService,
  ) {}

  listPackages() {
    return this.subscriptionsRepository.listPackages();
  }

  async createPackage(dto: CreateSubscriptionPackageDto) {
    return this.subscriptionsRepository.createPackage({
      name: dto.name.trim(),
      durationDays: dto.durationDays,
      price: dto.price,
    });
  }

  async listSubscriptions(query: ListSubscriptionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [stats, list] = await Promise.all([
      this.subscriptionsRepository.getSubscriptionStats(),
      this.subscriptionsRepository.listSubscriptions(page, limit),
    ]);

    return {
      stats,
      items: list.items,
      page: list.page,
      limit: list.limit,
      total: list.total,
    };
  }

  async getStudentSubscriptions(studentId: number) {
    const student = await this.studentsRepository.findByUserId(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const items =
      await this.subscriptionsRepository.listStudentSubscriptions(studentId);

    return { items };
  }

  async createSubscription(
    dto: CreateSubscriptionDto,
    actor: AuthenticatedUser,
  ) {
    const student = await this.usersService.findActiveUserByPhone(
      dto.studentPhone.trim(),
    );

    if (student.role !== 'student') {
      throw new BadRequestException('Student not found');
    }

    const subscriptionPackage =
      await this.subscriptionsRepository.findPackageById(dto.packageId);

    if (!subscriptionPackage) {
      throw new NotFoundException('Subscription package not found');
    }

    const startsOn = dto.startsAt;
    const endsOn = this.addDays(startsOn, subscriptionPackage.durationDays);

    const hasOverlap =
      await this.subscriptionsRepository.hasOverlappingSubscription(
        student.id,
        startsOn,
        endsOn,
      );

    if (hasOverlap) {
      throw new BadRequestException(
        'Subscription interval overlaps an existing subscription',
      );
    }

    return this.subscriptionsRepository.createSubscription({
      studentId: student.id,
      packageId: subscriptionPackage.id,
      startsAt: startsOn,
      endsAt: endsOn,
      amountPaid: dto.amountPaid,
      createdBy: actor.sub,
    });
  }

  private addDays(date: string, days: number) {
    const [year, month, day] = date.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    utc.setUTCDate(utc.getUTCDate() + days);
    return utc.toISOString().slice(0, 10);
  }
}
