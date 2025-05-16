import {AuthUser} from "../models/auth-user";

export interface TokenResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
  success: boolean;
  token: Token;
  message: string;
  response: string;
}

export interface Token {
  type: string;
  name: string | null;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string;
}