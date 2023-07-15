import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  contacts: any[] = [];

  constructor(private contactsService: ContactsService, private toastr: ToastrService) {}

  ngOnInit() {
    this.getContacts();
  }

  deleteContact(contactId: number) {
    this.contactsService.deleteContact(contactId).subscribe(
      () => {
        this.getContacts();
        this.toastr.success('Contato removido com sucesso', '');
      },
      (error) => {
        this.toastr.error('Ocorreu um erro ao remover o contato.', error);
      }
    );
  }

  getContacts() {
    this.contactsService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        this.toastr.error('Ocorreu um erro ao obter os contatos.', error);
      }
    );
  }
}
