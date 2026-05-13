import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationPolicyService } from './authorization-policy.service';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [DbModule],
  providers: [AuthorizationGuard, AuthorizationPolicyService, AuthorizationService],
  exports: [AuthorizationGuard, AuthorizationPolicyService, AuthorizationService],
})
export class AuthorizationModule {}
