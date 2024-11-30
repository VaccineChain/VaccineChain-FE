import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Token } from '../models/user';
import { Role, UserInfo } from '../models/profile';
import { Log } from '../models/log';

const ACCESS_KEY = 'ACCESS_TOKEN';
const USER_KEY = 'USER_DATA';
const ROLE_KEY = 'USER_ROLE';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(loginData: any) {
    return this.http.post<any>('/api/users/login', loginData);
  }

  register(data: any) {
    return this.http.post<any>('/api/users/register', data);
  }

  profile() {
    return this.http.get<any>('/api/users/profile');
  }

  updateProfile(data: any) {
    return this.http.put<any>('/api/users/profile', data);
  }

  changePassword(data: any) {
    return this.http.put<any>('/api/users/change-password', data);
  }

  logout() {
    this.clearLoginData();
  }

  clearLoginData() {
    this.storageService.remove(ACCESS_KEY);
    this.storageService.remove(USER_KEY);
    this.storageService.remove(ROLE_KEY);
  }

  //LOCAL SESSION
  saveUser(data: Token): void {
    this.saveToken(data.Token);
    this.storageService.save(ROLE_KEY, data.User.Role);
    this.storageService.save(USER_KEY, data.User);
  }

  saveToken(data: unknown) {
    this.storageService.save(ACCESS_KEY, data);
  }

  getTokenResponse() {
    if (this.storageService.get(USER_KEY)) {
      return this.storageService.get(USER_KEY) as Token;
    }
    return null;
  }

  getAccessToken() {
    if (this.storageService.get(ACCESS_KEY)) {
      return this.storageService.get(ACCESS_KEY) as string;
    }
    return '';
  }

  saveUserData(data: UserInfo) {
    this.storageService.save(USER_KEY, data);
  }

  getUserData() {
    if (this.storageService.get(USER_KEY)) {
      return this.storageService.get(USER_KEY);
    }
    return null;
  }

  getRoles(): Role | null {
    if (this.storageService.get(ROLE_KEY)) {
      return this.storageService.get(ROLE_KEY) as Role;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (this.getAccessToken()) {
      return true;
    }
    return false;
  }
}
