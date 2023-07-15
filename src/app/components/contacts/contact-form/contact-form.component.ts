import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepService } from 'src/app/services/cep.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private cepService: CepService) {
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

  onSubmit() {}

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
