import { Component, OnInit, ElementRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CepService } from 'src/app/services/cep.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  latitude!: number;
  longitude!: number;
  isEditMode = false;
  contactId!: number;
  isLoadingData: boolean = false;
  addresses: any;
  showAddressList: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cepService: CepService,
    private contactsService: ContactsService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute, private elementRef: ElementRef, private renderer: Renderer2
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
      const name = this.contactForm.get('name')?.value;
      const cpf = this.contactForm.get('cpf')?.value;
      const phone = this.contactForm.get('phone')?.value;
      const cep = this.contactForm.get('cep')?.value;
      const street = this.contactForm.get('street')?.value;
      const number = this.contactForm.get('number')?.value;
      const complement = this.contactForm.get('complement')?.value;
      const neighborhood = this.contactForm.get('neighborhood')?.value;
      const city = this.contactForm.get('city')?.value;
      const uf = this.contactForm.get('state')?.value;

      const long = this.longitude;
      const lat = this.latitude;

      if (this.isEditMode) {
        this.isLoadingData = true;
        this.contactsService.updateContact(this.contactId, name, cpf, phone, cep, street, number, complement, neighborhood, city, uf, long, lat).subscribe(
          (response) => {
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
        this.contactsService.createContact(name, cpf, phone, cep, street, number, complement, neighborhood, city, uf, long, lat).subscribe(
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
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
  
            this.cepService.getLocationCoordinatesByAddress(addressSearch).subscribe(
              (data) => {
                

                debugger
                this.addresses = data.body.results
              },
              (error) => {
                console.log('Erro na consulta do CEP:', error);
              }
            );
          },
          (error) => {
            console.log('Erro ao obter a localização:', error);
          }
        );
      } else {
        console.log('Geolocalização não suportada pelo navegador.');
      }
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