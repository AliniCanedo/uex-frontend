import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact } from 'src/app/shared/interfaces/contact.interface'
 
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  contacts: Contact[] = [];
  filterText = '';
  latitude!: number;
  longitude!: number;
  selectedContact: any;

  constructor(private contactsService: ContactsService, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {
    this.getContacts();
  }

  deleteContact(contactId: number) {
    this.contactsService.deleteContact(contactId).subscribe(
      (response) => {        
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
        if(error.error.error == "Missing token") {
          localStorage.removeItem('token');
          this.router.navigate(['/user']);
          this.toastr.error('Você precisa efetuar o login.', '');
        } else {
          this.toastr.error('Ocorreu um erro ao obter os contatos.', error);
        }        
      }
    );
  }

  getFilteredContacts() {
    const filteredContacts = this.contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        contact.phone.includes(this.filterText) ||
        contact.cpf.includes(this.filterText)
      );
    });
  
    filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
  
    return filteredContacts;
  }  

  addPin(contact: any) {
    if (this.selectedContact === contact) {
      this.selectedContact = null;
    } else {
      this.selectedContact = contact;
      this.latitude = contact.map.latitude;
      this.longitude = contact.map.longitude;
    }
  }
}
  
  
  

