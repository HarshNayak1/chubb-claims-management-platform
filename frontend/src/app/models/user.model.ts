export type Role = 'USER' | 'EMPLOYEE' | 'MANAGER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  fullName: string;
  role: Role;
}
