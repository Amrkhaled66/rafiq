import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { UsersModule } from '../users/users.module';
import { CoachesController } from './coaches.controller';
import { CoachesRepository } from './coaches.repository';
import { CoachesService } from './coaches.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule, UsersModule],
  controllers: [CoachesController],
  providers: [CoachesRepository, CoachesService],
  exports: [CoachesRepository, CoachesService],
})
export class CoachesModule {}
