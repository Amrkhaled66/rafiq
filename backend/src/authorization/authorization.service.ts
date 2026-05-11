import { ForbiddenException, Injectable } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { AuthorizationScopeService } from './authorization-scope.service';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { AuthorizationRequirement } from './types/authorization.types';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly abilityFactory: AbilityFactory,
    private readonly authorizationScopeService: AuthorizationScopeService,
  ) {}


  async assertAuthorized(
    user: AuthenticatedUser | undefined,
    requirement: AuthorizationRequirement,
    lookupValue?: unknown,
  ): Promise<void> {
    if (!user) {
      throw new ForbiddenException('Authenticated user context is missing');
    }

    const canPerformAction = this.abilityFactory.can(
      user.role,
      requirement.action,
      requirement.resource,
    );

    if (!canPerformAction) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }

    if (user.role === 'super_admin' || !requirement.lookup) {
      return;
    }

    const allowed = await this.authorizationScopeService.isAllowed(
      user,
      requirement.resource,
      requirement.action,
      requirement.lookup,
      lookupValue,
    );

    if (!allowed) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
  }
}
