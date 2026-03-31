import type { PublicUser } from '../users/user.types.js';

export interface RegisterBody {
  username: string;
  password: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}
