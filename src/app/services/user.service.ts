import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(user: User): Observable<any> {
    const url = `${environment.apiUrl}/users/sign_in`;
    const loginData = { user };
    return this.http.post(url, loginData);
  }

  register(user: User): Observable<any> {
    const url = `${environment.apiUrl}/users`;
    const registerData = { user };
    return this.http.post(url, registerData);    
  }

  logout() {
    const url = `${environment.apiUrl}/logout`;
    return this.http.delete(url);
  }

  update(user: User): Observable<any> {
    const url = `${environment.apiUrl}/user`;
    const updateData = { user };
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