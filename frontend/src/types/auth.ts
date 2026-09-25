export type Role = 'USER' | 'COMMUNITY_ADMIN' | 'ADMIN';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  status: AccountStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
