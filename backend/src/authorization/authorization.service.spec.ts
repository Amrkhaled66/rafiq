import { Test } from '@nestjs/testing';
import { AbilityFactory } from './ability.factory';
import { AuthorizationScopeService } from './authorization-scope.service';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;
  const authorizationScopeService = {
    isAllowed: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AbilityFactory,
        AuthorizationService,
        {
          provide: AuthorizationScopeService,
          useValue: authorizationScopeService,
        },
      ],
    }).compile();

    authorizationService = moduleRef.get(AuthorizationService);
    authorizationScopeService.isAllowed.mockReset();
  });

  it('allows super admin on any resource in the matrix', async () => {
    await expect(
      authorizationService.assertAuthorized(
        { sub: 1, role: 'super_admin' },
        { action: 'delete', resource: 'subscription_package' },
      ),
    ).resolves.toBeUndefined();
  });

  it('denies a student from updating a plan before scope checks', async () => {
    await expect(
      authorizationService.assertAuthorized(
        { sub: 10, role: 'student' },
        {
          action: 'update',
          resource: 'plan',
          lookup: { key: 'planId', kind: 'resourceId', source: 'params' },
        },
        5,
      ),
    ).rejects.toThrow('You are not allowed to perform this action');

    expect(authorizationScopeService.isAllowed).not.toHaveBeenCalled();
  });

  it('allows a student to update their own task session when scope passes', async () => {
    authorizationScopeService.isAllowed.mockResolvedValue(true);

    await expect(
      authorizationService.assertAuthorized(
        { sub: 10, role: 'student' },
        {
          action: 'update',
          resource: 'task_session',
          lookup: { key: 'sessionId', kind: 'resourceId', source: 'params' },
        },
        9,
      ),
    ).resolves.toBeUndefined();
  });

  it('denies a coach access to unassigned student resources', async () => {
    authorizationScopeService.isAllowed.mockResolvedValue(false);

    await expect(
      authorizationService.assertAuthorized(
        { sub: 77, role: 'coach' },
        {
          action: 'read',
          resource: 'task',
          lookup: { key: 'taskId', kind: 'resourceId', source: 'params' },
        },
        44,
      ),
    ).rejects.toThrow('You are not allowed to access this resource');
  });

  it('allows a coach to create lessons for an assigned student', async () => {
    authorizationScopeService.isAllowed.mockResolvedValue(true);

    await expect(
      authorizationService.assertAuthorized(
        { sub: 22, role: 'coach' },
        {
          action: 'create',
          resource: 'lesson',
          lookup: { key: 'studentId', kind: 'studentId', source: 'body' },
        },
        13,
      ),
    ).resolves.toBeUndefined();
  });

  it('denies a coach from mutating task sessions in v1', async () => {
    await expect(
      authorizationService.assertAuthorized(
        { sub: 22, role: 'coach' },
        {
          action: 'update',
          resource: 'task_session',
          lookup: { key: 'sessionId', kind: 'resourceId', source: 'params' },
        },
        13,
      ),
    ).rejects.toThrow('You are not allowed to perform this action');
  });
});
