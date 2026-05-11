import { SetMetadata } from '@nestjs/common';
import { AuthorizationRequirement } from '../types/authorization.types';

export const AUTHORIZATION_REQUIREMENT_KEY = 'authorization_requirement';

export const Authorize = (requirement: AuthorizationRequirement) =>
  SetMetadata(AUTHORIZATION_REQUIREMENT_KEY, requirement);
