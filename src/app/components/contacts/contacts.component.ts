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
  longitude: number = 0;
  latitude: number = 0;
  selectedContacts: Contact[] = [];

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
        debugger
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
    return this.contacts.filter(contact => {
      return (
        contact.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        contact.phone.includes(this.filterText) ||
        contact.cpf.includes(this.filterText)
      );
    });
  }
  addPin(contact: any) {
    console.log(contact);
    debugger;
    // this.selectedContacts = [contact.map.longitude, contact.map.latitude];

    // this.selectedContacts.push(contact);
    // this.latitude = contact.map.longitude;
    // this.longitude = contact.map.latitude;

      const index = this.selectedContacts.indexOf(contact);
      if (index === -1) {
        this.selectedContacts.push(contact);
        this.latitude = contact.map.latitude;
        this.longitude = contact.map.longitude;
      }

      console.log(this.selectedContacts);
    }
  }

  
  
  
  

