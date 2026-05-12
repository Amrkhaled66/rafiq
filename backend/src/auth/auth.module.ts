import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from '../db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_TOKEN'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    DbModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, UsersRepository],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
