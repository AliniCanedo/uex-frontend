import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) {}

  searchCep(cep: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3002/search-address/${cep}`);
  }

  getLocationCoordinatesByAddress(address: any): Observable<any> {    
    const addressData = { address: {address} };
    return this.http.post<any>('http://localhost:3002/address', addressData);
  }
}
