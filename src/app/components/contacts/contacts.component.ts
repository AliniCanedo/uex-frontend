import { Component } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  contacts: any[] = [];

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
    this.contactsService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        console.log('Erro ao obter contatos:', error);
      }
    );
  }
}
