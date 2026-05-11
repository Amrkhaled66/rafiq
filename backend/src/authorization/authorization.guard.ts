import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';
import { AUTHORIZATION_REQUIREMENT_KEY } from './decorators/authorize.decorator';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { AuthorizationRequirement } from './types/authorization.types';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.get(
      AUTHORIZATION_REQUIREMENT_KEY,
      context.getHandler(),
    );

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }

    const lookupValue = requirement.lookup
      ? request[requirement.lookup.source]?.[requirement.lookup.key]
      : undefined;

    await this.authorizationService.assertAuthorized(
      user,
      requirement,
      lookupValue,
    );

    return true;
  }
}
