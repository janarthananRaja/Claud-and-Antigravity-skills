import test from 'node:test';
import assert from 'node:assert/strict';
import { UserManagementService } from '../src/services/user-management.service.js';
import { UserEditorComponent } from '../src/components/user-editor.component.js';
import { UserProfile, UserFormState } from '../src/models/user-management.model.js';

test('1. Baseline Validation: Name length boundary (< 2 chars rejected)', () => {
  const service = new UserManagementService();
  const form: UserFormState = { name: 'A', email: 'test@example.com', role: 'COACH', academyId: 1 };
  const res = service.validateUserForm(form);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.name, 'Name must be at least 2 characters long');
});

test('2. Baseline Validation: Email regex check', () => {
  const service = new UserManagementService();
  const invalidEmail: UserFormState = { name: 'Rahul Dravid', email: 'not-an-email', role: 'COACH', academyId: 1 };
  const res = service.validateUserForm(invalidEmail);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.email, 'Valid email address is required');

  const validEmail: UserFormState = { name: 'Rahul Dravid', email: 'coach.rahul@csk.com', role: 'COACH', academyId: 1 };
  const validRes = service.validateUserForm(validEmail);
  assert.equal(validRes.isValid, true);
});

test('3. Baseline Validation: Role boundaries (ADMIN, COACH, STUDENT)', () => {
  const service = new UserManagementService();
  const invalidRole = { name: 'Player', email: 'p@csk.com', role: 'SPECTATOR' as any, academyId: 1 };
  const res = service.validateUserForm(invalidRole);

  assert.equal(res.isValid, false);
  assert.equal(res.errors.role, 'Role must be ADMIN, COACH, or STUDENT');
});

test('4. Baseline Authorization Guard: Only ADMIN can modify user', async () => {
  const service = new UserManagementService();
  const form: UserFormState = { name: 'Valid Coach', email: 'coach@csk.com', role: 'COACH', academyId: 1 };

  // Attempt update as COACH (non-admin)
  await assert.rejects(
    async () => await service.updateUser('usr_123', form, 'COACH'),
    /Access denied: Only ADMIN can modify user profiles/
  );

  // Attempt update as ADMIN
  const successRes = await service.updateUser('usr_123', form, 'ADMIN');
  assert.equal(successRes.success, true);
  assert.equal(successRes.user.name, 'Valid Coach');
});

test('5. Baseline Component Flow: End-to-end form lifecycle & state transitions', async () => {
  const service = new UserManagementService();
  const component = new UserEditorComponent(service);

  const initialUser: UserProfile = {
    id: 'u101',
    name: 'MS Dhoni',
    email: 'msd@csk.com',
    role: 'COACH',
    academyId: 1,
    isActive: true
  };

  component.initUser(initialUser, 'ADMIN');
  assert.equal(component.formState.name, 'MS Dhoni');

  // Trigger invalid edit
  component.formState.email = 'invalid-email-format';
  const failedSubmit = await component.onSubmit();
  assert.equal(failedSubmit.success, false);
  assert.ok(component.errors.email);

  // Correct email & submit
  component.formState.email = 'captain.msd@csk.com';
  const successSubmit = await component.onSubmit();
  assert.equal(successSubmit.success, true);
  assert.equal(component.savedUser?.email, 'captain.msd@csk.com');
  assert.equal(component.successMessage, 'User profile updated successfully');
});
