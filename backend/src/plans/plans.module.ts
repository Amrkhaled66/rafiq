import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { CoachesModule } from '../coaches/coaches.module';
import { DbModule } from '../db/db.module';
import { StudentsModule } from '../students/students.module';
import { TaskSessionsModule } from '../task-sessions/task-sessions.module';
import { LessonOccurrencesModule } from '../lesson-occurrences/lesson-occurrences.module';
import { PlansController } from './plans.controller';
import { PlansRepository } from './plans.repository';
import { PlansService } from './plans.service';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    CoachesModule,
    DbModule,
    forwardRef(() => StudentsModule),
    TaskSessionsModule,
    LessonOccurrencesModule,
  ],
  controllers: [PlansController],
  providers: [PlansRepository, PlansService],
  exports: [PlansRepository],
})
export class PlansModule {}
