import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { LessonOccurrencesModule } from '../lesson-occurrences/lesson-occurrences.module';
import { LessonsModule } from '../lessons/lessons.module';
import { MissedLessonsModule } from '../missed-lessons/missed-lessons.module';
import { MissedTasksModule } from '../missed-tasks/missed-tasks.module';
import { PlansModule } from '../plans/plans.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    DbModule,
    forwardRef(() => TasksModule),
    LessonOccurrencesModule,
    forwardRef(() => LessonsModule),
    MissedTasksModule,
    MissedLessonsModule,
    forwardRef(() => PlansModule),
    UsersModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsRepository, StudentsService],
  exports: [StudentsRepository, StudentsService],
})
export class StudentsModule {}
