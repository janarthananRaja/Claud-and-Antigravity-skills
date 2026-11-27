import { UserFormState, FormValidationErrors, UserProfile, UserRole } from '../models/user-management.model.js';
import { UserManagementService } from '../services/user-management.service.js';

/**
 * React Hook State logic translating Angular reactive form component.
 */
export class UserEditorStateModel {
  userId: string = '';
  currentUserRole: string = 'ADMIN';

  formState: UserFormState = {
    name: '',
    email: '',
    role: 'COACH',
    academyId: 1
  };

  errors: FormValidationErrors = {};
  isLoading: boolean = false;
  successMessage: string = '';
  generalError: string = '';
  savedUser: UserProfile | null = null;

  constructor(private userService: UserManagementService) {}

  initUser(user: UserProfile, currentUserRole: string = 'ADMIN') {
    this.userId = user.id;
    this.currentUserRole = currentUserRole;
    this.formState = {
      name: user.name,
      email: user.email,
      role: user.role,
      academyId: user.academyId
    };
    this.errors = {};
    this.successMessage = '';
    this.generalError = '';
  }

  setField<K extends keyof UserFormState>(field: K, value: UserFormState[K]) {
    this.formState[field] = value;
  }

  async handleSubmit(): Promise<{ success: boolean; error?: string }> {
    this.errors = {};
    this.generalError = '';
    this.successMessage = '';

    const validation = this.userService.validateUserForm(this.formState);
    if (!validation.isValid) {
      this.errors = validation.errors;
      return { success: false, error: 'Validation failed' };
    }

    this.isLoading = true;
    try {
      const response = await this.userService.updateUser(this.userId, this.formState, this.currentUserRole);
      this.savedUser = response.user;
      this.successMessage = response.message;
      return { success: true };
    } catch (err: any) {
      this.generalError = err.message || 'Error updating user profile';
      return { success: false, error: this.generalError };
    } finally {
      this.isLoading = false;
    }
  }
}
