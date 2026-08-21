import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { TasksModule } from '../tasks/tasks.module';
import { DailyTaskProgressController } from './daily-task-progress.controller';
import { DailyTaskProgressRepository } from './daily-task-progress.repository';
import { DailyTaskProgressService } from './daily-task-progress.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule, TasksModule],
  controllers: [DailyTaskProgressController],
  providers: [DailyTaskProgressRepository, DailyTaskProgressService],
})
export class DailyTaskProgressModule {}
