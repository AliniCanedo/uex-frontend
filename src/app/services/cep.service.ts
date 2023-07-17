import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) {}

  searchCep(cep: string): Observable<any> {
    const url = `${environment.apiUrl}/search-address/${cep}`;
    return this.http.get<any>(url);
  }

  getLocationCoordinatesByAddress(address: any): Observable<any> {    
    const url = `${environment.apiUrl}/address`;
    const addressData = { address: {address} };
    return this.http.post<any>(url, addressData);
  }
}

