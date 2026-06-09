import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentsModule } from '../students/students.module';
import { TasksModule } from '../tasks/tasks.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    LessonsModule,
    StudentsModule,
    TasksModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
