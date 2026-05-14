import { SetMetadata } from '@nestjs/common';

export const AUTHORIZATION_NAMED_POLICY_KEY = 'authorization_named_policy';

export const RequirePolicy = (policyName: string) =>
  SetMetadata(AUTHORIZATION_NAMED_POLICY_KEY, policyName);
