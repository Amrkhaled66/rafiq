import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { StudentsModule } from '../students/students.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    DbModule,
    forwardRef(() => StudentsModule),
  ],
  controllers: [TasksController],
  providers: [TasksRepository, TasksService],
  exports: [TasksRepository],
})
export class TasksModule {}
