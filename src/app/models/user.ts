import { UserInfo } from './profile';

export interface TokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  refresh_expires_in: number;
  roles: string[];
}

export interface Token {
  Success: boolean;
  Secret: string;
  Message: string;
  Token: string;
  User: UserInfo;
}

export enum Roles {
  ADMIN = 'Admin',
  USER = 'User',
}
