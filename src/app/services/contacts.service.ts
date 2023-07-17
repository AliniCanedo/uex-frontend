import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any> {
    return this.http.get('http://localhost:3002/contacts');
  }

  createContact(name: string, cpf: string, phone: string, cep: string, street: string, number: string, complement: string, neighborhood: string, city: string, uf: string, longitude: number, latitude: number): Observable<any> {
    const contactData = { contact: { name, cpf, phone, address_attributes: { cep, street, number, complement, neighborhood, city, uf, map_attributes: { longitude, latitude} } } };
    return this.http.post('http://localhost:3002/contacts', contactData);
  }

  getContact(contactId: number): Observable<any> {
    return this.http.get(`http://localhost:3002/contacts/${contactId}`);
  }

  updateContact(contactId: number, name: string, cpf: string, phone: string, cep: string, street: string, number: string, complement: string, neighborhood: string, city: string, uf: string, latitude: number, longitude: number): Observable<any> {
    const contactData = { contact: { name, cpf, phone, address_attributes: { cep, street, number, complement, neighborhood, city, uf, map_attributes: { latitude, longitude } } } };
    return this.http.put(`http://localhost:3002/contacts/${contactId}`, contactData);
  }

  deleteContact(contactId: number): Observable<any> {
    return this.http.delete(`http://localhost:3002/contacts/${contactId}`);
  }
}
