import { Test } from '@nestjs/testing';
import { AuthorizationPolicyService } from './authorization-policy.service';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;
  const authorizationPolicyService = {
    authorize: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: AuthorizationPolicyService,
          useValue: authorizationPolicyService,
        },
      ],
    }).compile();

    authorizationService = moduleRef.get(AuthorizationService);
    authorizationPolicyService.authorize.mockReset();
  });

  it('allows super admin on any resource in the matrix', async () => {
    authorizationPolicyService.authorize.mockResolvedValue('allowed');

    await expect(
      authorizationService.assertAuthorized(
        { sub: 1, role: 'super_admin' },
        { action: 'delete', resource: 'subscription_package' },
      ),
    ).resolves.toBeUndefined();
  });

  it('denies a student from updating a plan before scope checks', async () => {
    authorizationPolicyService.authorize.mockResolvedValue('action_denied');

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

    expect(authorizationPolicyService.authorize).toHaveBeenCalled();
  });

  it('allows a student to update their own task session when scope passes', async () => {
    authorizationPolicyService.authorize.mockResolvedValue('allowed');

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
    authorizationPolicyService.authorize.mockResolvedValue('scope_denied');

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
    authorizationPolicyService.authorize.mockResolvedValue('allowed');

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
    authorizationPolicyService.authorize.mockResolvedValue('action_denied');

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
