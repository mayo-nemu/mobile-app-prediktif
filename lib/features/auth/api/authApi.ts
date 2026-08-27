import { apiRequest } from '../../../shared/api/apiClient';
import { getAuthApiUrl } from '../../../shared/api/env';

export type LoginCredentials = {
  name: string;
  password: string;
};

export type AuthenticatedUser = {
  userId: number;
  name: string;
  is_Operator: boolean;
  is_Technician: boolean;
  is_Engineer: boolean;
  created_At: string;
};

export type LoginResult = {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthenticatedUser;
};

export function login(credentials: LoginCredentials): Promise<LoginResult> {
  return apiRequest<LoginResult>(getAuthApiUrl(), '/api/users/login', {
    method: 'POST',
    body: credentials,
  });
}
