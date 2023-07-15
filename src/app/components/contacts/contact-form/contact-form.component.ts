import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CepService } from 'src/app/services/cep.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  latitude!: number;
  longitude!: number;

  constructor(private formBuilder: FormBuilder, 
              private cepService: CepService, 
              private contactsService: ContactsService, 
              private router: Router,
              private toastr: ToastrService) {
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
      state: ['', Validators.required]
    });
  }

  onSubmit() {
    if(this.contactForm.valid) {
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
      const lat = this.latitude

      this.contactsService.createContact(name, cpf, phone, cep, street, number, complement, neighborhood, city, uf, long, lat).subscribe(
        (response) => {
          debugger
          this.router.navigate(['/contacts']);
          this.toastr.success('Contato cadastrado com sucesso.', '');
        },
        (error) => {
          debugger
          this.toastr.error('Ocorreu um erro ao cadastrar contato.', '');
        }
      );
    } else {

    }
  }

  onCepChange() {
    const cepControl = this.contactForm.get('cep');
    if (cepControl && cepControl.value) {
      this.searchCep(cepControl.value);
    }
  }
  searchCep(cep: string) {
    this.cepService.searchCep(cep).subscribe(
      (data) => {
        debugger
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
}
