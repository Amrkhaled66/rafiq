import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { MissedTasksController } from './missed-tasks.controller';
import { MissedTasksRepository } from './missed-tasks.repository';
import { MissedTasksService } from './missed-tasks.service';
import { TasksModule } from '../tasks/tasks.module';
@Module({
  imports: [AuthModule, DbModule, AuthorizationModule, TasksModule],
  controllers: [MissedTasksController],
  providers: [MissedTasksRepository, MissedTasksService],
})
export class MissedTasksModule {}
