import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorizationPolicyService } from './authorization-policy.service';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { AuthorizationRequirement } from './types/authorization.types';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly authorizationPolicyService: AuthorizationPolicyService,
  ) {}

  async assertAuthorized(
    user: AuthenticatedUser | undefined,
    requirement: AuthorizationRequirement,
    lookupValue?: unknown,
  ): Promise<void> {
    if (!user) {
      throw new ForbiddenException('Authenticated user context is missing');
    }

    const decision = await this.authorizationPolicyService.authorize(
      user,
      requirement,
      lookupValue,
    );

    if (decision === 'action_denied') {
      throw new ForbiddenException('You are not allowed to perform this action');
    }

    if (decision === 'allowed') {
      return;
    }

    throw new ForbiddenException('You are not allowed to access this resource');
  }
}
