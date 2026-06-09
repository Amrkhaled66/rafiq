import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { StudentsModule } from '../students/students.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    AuthModule,
    DbModule,
    AuthorizationModule,
    StudentsModule,
    UsersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsRepository, SubscriptionsService],
})
export class SubscriptionsModule {}
