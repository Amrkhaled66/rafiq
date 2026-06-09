import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CurrentUser } from '../authorization/decorators/current-user.decorator';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import type { AuthenticatedUser } from '../authorization/types/authenticated-user.type';
import { CreateSubscriptionPackageDto } from './dto/create-subscription-package.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ListSubscriptionsQueryDto } from './dto/list-subscriptions-query.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('subscription-packages')
  @RequirePolicy('subscription_packages.list')
  listPackages() {
    return this.subscriptionsService.listPackages();
  }

  @Post('subscription-packages')
  @RequirePolicy('subscription_packages.create')
  createPackage(@Body() dto: CreateSubscriptionPackageDto) {
    return this.subscriptionsService.createPackage(dto);
  }

  @Get('subscriptions')
  @RequirePolicy('subscriptions.list')
  listSubscriptions(@Query() query: ListSubscriptionsQueryDto) {
    return this.subscriptionsService.listSubscriptions(query);
  }

  @Get('students/:studentId/subscriptions')
  @RequirePolicy('subscriptions.list_by_student')
  getStudentSubscriptions(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.subscriptionsService.getStudentSubscriptions(studentId);
  }

  @Post('subscriptions')
  @RequirePolicy('subscriptions.create')
  createSubscription(
    @Body() dto: CreateSubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.createSubscription(dto, user);
  }
}
