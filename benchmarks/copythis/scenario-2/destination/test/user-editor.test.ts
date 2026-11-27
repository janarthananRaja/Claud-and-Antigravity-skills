import test from 'node:test';
import assert from 'node:assert/strict';
import { UserManagementService } from '../src/features/users/services/user-management.service.js';
import { UserEditorStateModel } from '../src/features/users/hooks/useUserEditor.js';
import { UserProfile, UserFormState } from '../src/features/users/models/user-management.model.js';

test('1. Destination Parity: Name length boundary (< 2 chars rejected)', () => {
  const service = new UserManagementService();
  const form: UserFormState = { name: 'A', email: 'test@example.com', role: 'COACH', academyId: 1 };
  const res = service.validateUserForm(form);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.name, 'Name must be at least 2 characters long');
});

test('2. Destination Parity: Email regex check', () => {
  const service = new UserManagementService();
  const invalidEmail: UserFormState = { name: 'Rahul Dravid', email: 'not-an-email', role: 'COACH', academyId: 1 };
  const res = service.validateUserForm(invalidEmail);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.email, 'Valid email address is required');

  const validEmail: UserFormState = { name: 'Rahul Dravid', email: 'coach.rahul@csk.com', role: 'COACH', academyId: 1 };
  const validRes = service.validateUserForm(validEmail);
  assert.equal(validRes.isValid, true);
});

test('3. Destination Parity: Role boundaries (ADMIN, COACH, STUDENT)', () => {
  const service = new UserManagementService();
  const invalidRole = { name: 'Player', email: 'p@csk.com', role: 'SPECTATOR' as any, academyId: 1 };
  const res = service.validateUserForm(invalidRole);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.role, 'Role must be ADMIN, COACH, or STUDENT');
});

test('4. Destination Parity: Role Guard: Only ADMIN can modify user', async () => {
  const service = new UserManagementService();
  const form: UserFormState = { name: 'Valid Coach', email: 'coach@csk.com', role: 'COACH', academyId: 1 };

  await assert.rejects(
    async () => await service.updateUser('usr_123', form, 'COACH'),
    /Access denied: Only ADMIN can modify user profiles/
  );

  const successRes = await service.updateUser('usr_123', form, 'ADMIN');
  assert.equal(successRes.success, true);
  assert.equal(successRes.user.name, 'Valid Coach');
});

test('5. Destination Parity: React State Model Flow & Transitions', async () => {
  const service = new UserManagementService();
  const model = new UserEditorStateModel(service);

  const initialUser: UserProfile = {
    id: 'u101',
    name: 'MS Dhoni',
    email: 'msd@csk.com',
    role: 'COACH',
    academyId: 1,
    isActive: true
  };

  model.initUser(initialUser, 'ADMIN');
  assert.equal(model.formState.name, 'MS Dhoni');

  model.setField('email', 'invalid-email-format');
  const failedSubmit = await model.handleSubmit();
  assert.equal(failedSubmit.success, false);
  assert.ok(model.errors.email);

  model.setField('email', 'captain.msd@csk.com');
  const successSubmit = await model.handleSubmit();
  assert.equal(successSubmit.success, true);
  assert.equal(model.savedUser?.email, 'captain.msd@csk.com');
  assert.equal(model.successMessage, 'User profile updated successfully');
});
