import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  constructor() { }

  isAuthenticated(): boolean {
    const authToken = localStorage.getItem(this.tokenKey);
    return !!authToken;
  }
}
