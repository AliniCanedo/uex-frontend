import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { user: {email, password} };
    return this.http.post('http://localhost:3002/users/sign_in', loginData);
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const registerData = { user: {name, email, password, password_confirmation} };
    return this.http.post('http://localhost:3002/users', registerData);    
  }

  logout() {
    return this.http.delete('http://localhost:3002/logout');
  }

  update(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const updateData = { user: {name, email, password, password_confirmation} };
    return this.http.patch('http://localhost:3002/user', updateData)
  }

  delete(): Observable<any> {
    return this.http.delete('http://localhost:3002/user')
  }

  getUser(): Observable<any> {
    return this.http.get('http://localhost:3002/user');
  }
}
