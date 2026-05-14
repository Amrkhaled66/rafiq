import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorizationPolicyService } from './authorization-policy.service';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly authorizationPolicyService: AuthorizationPolicyService,
  ) {}

  async assertNamedPolicyAuthorized(
    user: AuthenticatedUser | undefined,
    policyName: string,
    request: Record<string, unknown>,
  ): Promise<void> {
    if (!user) {
      throw new ForbiddenException('Authenticated user context is missing');
    }

    const decision = await this.authorizationPolicyService.authorizeNamedPolicy(
      user,
      policyName,
      request,
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
