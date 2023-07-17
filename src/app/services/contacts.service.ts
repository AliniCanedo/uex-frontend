import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any> {
    const url = `${environment.apiUrl}/contacts`;
    return this.http.get(url);
  }

  createContact(name: string, cpf: string, phone: string, cep: string, street: string, number: string, complement: string, neighborhood: string, city: string, uf: string, longitude: number, latitude: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts`;
    const contactData = { contact: { name, cpf, phone, address_attributes: { cep, street, number, complement, neighborhood, city, uf, map_attributes: { longitude, latitude} } } };
    return this.http.post(url, contactData);
  }

  getContact(contactId: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    return this.http.get(url);
  }

  updateContact(contactId: number, name: string, cpf: string, phone: string, cep: string, street: string, number: string, complement: string, neighborhood: string, city: string, uf: string, latitude: number, longitude: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    const contactData = { contact: { name, cpf, phone, address_attributes: { cep, street, number, complement, neighborhood, city, uf, map_attributes: { latitude, longitude } } } };
    return this.http.put(url, contactData);
  }

  deleteContact(contactId: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    return this.http.delete(url);
  }
}
