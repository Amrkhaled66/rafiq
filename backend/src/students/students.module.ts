import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { DbModule } from '../db/db.module';
import { UsersModule } from '../users/users.module';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [AuthModule, AuthorizationModule, DbModule, UsersModule],
  controllers: [StudentsController],
  providers: [StudentsRepository, StudentsService],
  exports: [StudentsRepository, StudentsService],
})
export class StudentsModule {}
