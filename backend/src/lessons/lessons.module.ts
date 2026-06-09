import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { StudentsModule } from '../students/students.module';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule, StudentsModule],
  controllers: [LessonsController],
  providers: [LessonsRepository, LessonsService],
  exports: [LessonsRepository, LessonsService],
})
export class LessonsModule {}
