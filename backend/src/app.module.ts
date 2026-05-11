import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, AuthorizationModule, UsersModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
