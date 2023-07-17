import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CepService } from 'src/app/services/cep.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { Address } from 'src/app/shared/interfaces/address.interface';
import { Contact } from 'src/app/shared/interfaces/contact.interface';
import { MapAddress } from 'src/app/shared/interfaces/map.interface';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  latitude!: number;
  longitude!: number;  
  contactId!: number;  
  addresses: any;
  isLoadingData: boolean = false;  
  showAddressList: boolean = false;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private cepService: CepService,
    private contactsService: ContactsService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      phone: ['', Validators.required],
      cep: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      addressSearch: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contactId = +params['id'];
      this.isEditMode = !isNaN(this.contactId);

      if (this.isEditMode) {
        this.contactsService.getContact(this.contactId).subscribe(
          (contact) => {
            this.contactForm.patchValue({
              name: contact.name,
              cpf: contact.cpf,
              phone: contact.phone,
              cep: contact.address.cep,
              street: contact.address.street,
              number: contact.address.number,
              complement: contact.address.complement,
              neighborhood: contact.address.neighborhood,
              city: contact.address.city,
              state: contact.address.uf
            });
            this.latitude = contact.address.map.latitude;
            this.longitude = contact.address.map.longitude;
          },
          (error) => {
            console.log('Erro ao obter os dados do contato:', error);
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const map: MapAddress = {  
        latitude: this.latitude,
        longitude: this.longitude,
      }
      const address: Address = {
        cep: this.contactForm.get('cep')?.value,
        street: this.contactForm.get('street')?.value,
        number: this.contactForm.get('number')?.value,
        complement: this.contactForm.get('complement')?.value,
        neighborhood: this.contactForm.get('neighborhood')?.value,
        city: this.contactForm.get('city')?.value,
        uf: this.contactForm.get('state')?.value,
        contact_id: this.contactId,
        map_attributes: map
      }
      const contact: Contact = {
        id: this.contactId || 0,
        name: this.contactForm.get('name')?.value,
        cpf: this.contactForm.get('cpf')?.value,
        phone: this.contactForm.get('phone')?.value,
        address_attributes: address
      }

      if (this.isEditMode) {
        this.isLoadingData = true;
        this.contactsService.updateContact(contact, this.contactId).subscribe(
          () => {
            this.router.navigate(['/contacts']);
            this.toastr.success('Contato atualizado com sucesso.', '');
          },
          (error) => {
            if (error.error && error.error.errors && typeof error.error.errors === 'object') {
              for (var key in error.error.errors) {
                if (error.error.errors.hasOwnProperty(key)) {
                  this.toastr.error(error.error.errors[key], '');
                  this.isLoadingData = false;
                }
              }
            }
          },
          () => {
            this.isLoadingData = false;
          }
        );
      } else {
        this.contactsService.createContact(contact).subscribe(
          () => {
            this.router.navigate(['/contacts']);
            this.toastr.success('Contato cadastrado com sucesso.', '');
          },
          (error) => {
            if (error.error && error.error.errors && typeof error.error.errors === 'object') {
              for (var key in error.error.errors) {
                if (error.error.errors.hasOwnProperty(key)) {
                  this.toastr.error(error.error.errors[key], '');
                }
              }
            } else {
              this.toastr.error('Ocorreu um erro ao cadastrar contato.', '');
            }
          }
        );
      }
    }
  }

  searchCep() {
    const cep = this.contactForm.value.cep
    this.cepService.searchCep(cep).subscribe(
      (data) => {
        this.latitude = data.latitude;
        this.longitude = data.longitude;

        this.contactForm.patchValue({
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        });
      },
      (error) => {
        console.log('Erro na consulta do CEP:', error);
      }
    );
  }

  searchAddress() {
    const addressSearchControl = this.contactForm.get('street');
  
    if (addressSearchControl) {
      const addressSearch = addressSearchControl.value;
      this.cepService.getLocationCoordinatesByAddress(addressSearch).subscribe(
        (data) => {
          this.addresses = data.body.results.slice(0, 5)
        },
        () => {
          this.toastr.error('Erro na consulta do CEP:', '');
        }
      );
    }
  }

  selectAddress(address: any) {   
    this.latitude = address.geometry.location.lat;
    this.longitude = address.geometry.location.lng;

    let formatted_address = address.formatted_address.split(',')

    this.contactForm.patchValue({
      
      street:  formatted_address[0],
      cep: formatted_address[3],      
      neighborhood: formatted_address[1].split('-')[1],
      city: formatted_address[2],
      state: formatted_address[2].split('-')[1]
    }); 
  }

  onFocusIn() {
    this.showAddressList = true;
  }
  
  onFocusOut() {
    setTimeout(() => {
      this.showAddressList = false;
    }, 200);
  }  
}
