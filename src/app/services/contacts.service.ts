import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from '../shared/interfaces/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any> {
    const url = `${environment.apiUrl}/contacts`;
    return this.http.get(url);
  }

  createContact(contact: Contact): Observable<any> {
    const url = `${environment.apiUrl}/contacts`;
    const contactData = { contact };
    return this.http.post(url, contactData);
  }

  getContact(contactId: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    return this.http.get(url);
  }

  updateContact(contact: Contact, contactId: number): Observable<any> {
    debugger
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    const contactData = { contact };
    return this.http.put(url, contactData);
  }

  deleteContact(contactId: number): Observable<any> {
    const url = `${environment.apiUrl}/contacts/${contactId}`;
    return this.http.delete(url);
  }
}
