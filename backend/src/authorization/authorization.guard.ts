import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';
import { AUTHORIZATION_NAMED_POLICY_KEY } from './decorators/require-policy.decorator';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const namedPolicy = this.reflector.get(
      AUTHORIZATION_NAMED_POLICY_KEY,
      context.getHandler(),
    );

    if (!namedPolicy) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }

    await this.authorizationService.assertNamedPolicyAuthorized(
      user,
      namedPolicy,
      request as Record<string, unknown>,
    );

    return true;
  }
}
