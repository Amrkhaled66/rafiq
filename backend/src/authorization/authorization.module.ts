import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AbilityFactory } from './ability.factory';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationScopeService } from './authorization-scope.service';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [DbModule],
  providers: [
    AbilityFactory,
    AuthorizationGuard,
    AuthorizationScopeService,
    AuthorizationService,
  ],
  exports: [AuthorizationGuard, AuthorizationService, AbilityFactory],
})
export class AuthorizationModule {}
