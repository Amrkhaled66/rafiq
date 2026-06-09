import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { CoachesModule } from './coaches/coaches.module';
import { HomeModule } from './home/home.module';
import { LessonsModule } from './lessons/lessons.module';
import { MissedTasksModule } from './missed-tasks/missed-tasks.module';
import { PlansModule } from './plans/plans.module';
import { StudentsModule } from './students/students.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskSessionsModule } from './task-sessions/task-sessions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    UsersModule,
    StudentsModule,
    CoachesModule,
    TasksModule,
    HomeModule,
    LessonsModule,
    MissedTasksModule,
    PlansModule,
    SubscriptionsModule,
    TaskSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
