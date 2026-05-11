import { userRoleEnum } from '../../db';

export type AppRole = (typeof userRoleEnum.enumValues)[number];

export interface AuthenticatedUser {
  sub: number;
  role: AppRole;
}
