import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { LessonOccurrencesController } from './lesson-occurrences.controller';
import { LessonOccurrencesRepository } from './lesson-occurrences.repository';
import { LessonOccurrencesService } from './lesson-occurrences.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule],
  controllers: [LessonOccurrencesController],
  providers: [LessonOccurrencesRepository, LessonOccurrencesService],
  exports: [LessonOccurrencesRepository, LessonOccurrencesService],
})
export class LessonOccurrencesModule {}
