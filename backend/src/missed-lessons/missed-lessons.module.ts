import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { MissedLessonsController } from './missed-lessons.controller';
import { MissedLessonsRepository } from './missed-lessons.repository';
import { MissedLessonsService } from './missed-lessons.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule],
  controllers: [MissedLessonsController],
  providers: [MissedLessonsRepository, MissedLessonsService],
})
export class MissedLessonsModule {}
