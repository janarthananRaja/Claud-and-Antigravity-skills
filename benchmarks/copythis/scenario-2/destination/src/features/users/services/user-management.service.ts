import { UserProfile, UserFormState, FormValidationErrors, UpdateUserResponse } from '../models/user-management.model.js';

export class UserManagementService {
  /**
   * Preserved: Business validation constraints & boundary checks.
   */
  validateUserForm(form: UserFormState): { isValid: boolean; errors: FormValidationErrors } {
    const errors: FormValidationErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email.trim())) {
      errors.email = 'Valid email address is required';
    }

    if (!['ADMIN', 'COACH', 'STUDENT'].includes(form.role)) {
      errors.role = 'Role must be ADMIN, COACH, or STUDENT';
    }

    if (!form.academyId || form.academyId <= 0) {
      errors.academyId = 'Valid academy ID is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Preserved: Role-based authorization guard & async contract.
   */
  async updateUser(userId: string, form: UserFormState, currentUserRole: string): Promise<UpdateUserResponse> {
    if (currentUserRole !== 'ADMIN') {
      throw new Error('Access denied: Only ADMIN can modify user profiles');
    }

    const validation = this.validateUserForm(form);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }

    return {
      success: true,
      user: {
        id: userId,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        academyId: form.academyId,
        isActive: true
      },
      message: 'User profile updated successfully'
    };
  }
}
