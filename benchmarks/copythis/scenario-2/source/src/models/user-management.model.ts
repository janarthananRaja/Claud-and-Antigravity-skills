export type UserRole = 'ADMIN' | 'COACH' | 'STUDENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  academyId: number;
}

export interface UserFormState {
  name: string;
  email: string;
  role: UserRole;
  academyId: number;
}

export interface FormValidationErrors {
  name?: string;
  email?: string;
  role?: string;
  academyId?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  user: UserProfile;
  message: string;
}
