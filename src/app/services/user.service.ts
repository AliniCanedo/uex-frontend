import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${environment.apiUrl}/users/sign_in`;
    const loginData = { user: {email, password} };
    return this.http.post(url, loginData);
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const url = `${environment.apiUrl}/users`;
    const registerData = { user: {name, email, password, password_confirmation} };
    return this.http.post(url, registerData);    
  }

  logout() {
    const url = `${environment.apiUrl}/logout`;
    return this.http.delete(url);
  }

  update(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const url = `${environment.apiUrl}/user`;
    const updateData = { user: {name, email, password, password_confirmation} };
    return this.http.patch(url, updateData)
  }

  delete(): Observable<any> {
    const url = `${environment.apiUrl}/user`;
    return this.http.delete(url)
  }

  getUser(): Observable<any> {
    const url = `${environment.apiUrl}/user`;
    return this.http.get(url);
  }
}