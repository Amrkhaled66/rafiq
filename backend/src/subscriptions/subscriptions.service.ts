import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { getCairoDateString } from '../common/dates/cairo-date';
import { LessonOccurrencesService } from '../lesson-occurrences/lesson-occurrences.service';
import { StudentsRepository } from '../students/students.repository';
import { UsersService } from '../users/users.service';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { CreateSubscriptionPackageDto } from './dto/create-subscription-package.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ListExpiringSubscriptionsQueryDto } from './dto/list-expiring-subscriptions-query.dto';
import { ListSubscriptionsQueryDto } from './dto/list-subscriptions-query.dto';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly usersService: UsersService,
    private readonly lessonOccurrencesService: LessonOccurrencesService,
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
      this.subscriptionsRepository.listSubscriptions({
        page,
        limit,
        endingSoon: query.endingSoon,
      }),
    ]);

    return {
      stats,
      items: list.items,
      page: list.page,
      limit: list.limit,
      total: list.total,
    };
  }

  async listExpiringSubscriptions(query: ListExpiringSubscriptionsQueryDto) {
    const days = query.days ?? 7;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const list = await this.subscriptionsRepository.listExpiringSubscriptions({
      days,
      page,
      limit,
    });

    return { ...list, days };
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

    const created = await this.subscriptionsRepository.createSubscription({
      studentId: student.id,
      packageId: subscriptionPackage.id,
      startsAt: startsOn,
      endsAt: endsOn,
      amountPaid: dto.amountPaid,
      createdBy: actor.sub,
    });

    await this.lessonOccurrencesService.generateForSubscription(created.id);
    return created;
  }

  async cancelSubscription(
    subscriptionId: number,
    dto: CancelSubscriptionDto,
    actor: AuthenticatedUser,
  ) {
    const reason = dto.reason.trim();

    if (!reason) {
      throw new BadRequestException('Cancellation reason is required');
    }

    const subscription =
      await this.subscriptionsRepository.findSubscriptionById(subscriptionId);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.cancelledAt) {
      throw new ConflictException('Subscription is already cancelled');
    }

    if (subscription.endsAt < getCairoDateString()) {
      throw new ConflictException('Ended subscriptions cannot be cancelled');
    }

    const cancelled = await this.subscriptionsRepository.cancelSubscription({
      subscriptionId,
      cancelledBy: actor.sub,
      reason,
      today: getCairoDateString(),
    });

    if (!cancelled) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      ...cancelled,
      status: 'cancelled' as const,
    };
  }

  private addDays(date: string, days: number) {
    const [year, month, day] = date.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    utc.setUTCDate(utc.getUTCDate() + days);
    return utc.toISOString().slice(0, 10);
  }
}
