import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { TaskSessionsController } from './task-sessions.controller';
import { TaskSessionsRepository } from './task-sessions.repository';
import { TaskSessionsService } from './task-sessions.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule],
  controllers: [TaskSessionsController],
  providers: [TaskSessionsRepository, TaskSessionsService],
})
export class TaskSessionsModule {}
