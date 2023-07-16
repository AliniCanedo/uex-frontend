import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileForm: FormGroup;
  user: any = {};

  constructor(private formBuilder: FormBuilder, 
              private userService: UserService, 
              private toastr: ToastrService,
              private router: Router) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],      
      password_confirmation: ['', Validators.required]
    });
    this.user = {};
  }

  ngOnInit() {
    this.userService.getUser().subscribe(
      (response) => {
        this.user = response.user
      },
      (error) => {
        localStorage.removeItem('token');
        this.router.navigate(['/user']);
        this.toastr.error('Faça o login novamente.', '');
      }
    );
  } 

  onSubmit() {
    if(this.profileForm.valid) {
      const name = this.profileForm.get('name')?.value;
      const email = this.profileForm.get('email')?.value;
      const password = this.profileForm.get('password')?.value;
      const password_confirmation = this.profileForm.get('password_confirmation')?.value;

      this.userService.update(name, email, password, password_confirmation).subscribe(
        (response) => {
          this.toastr.success('Cadastro atualizado com sucesso.', '');
          this.profileForm.reset();
        },
        (error) => {
          if (error.error && error.error.errors && typeof error.error.errors === 'object') {
            for (var key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                this.toastr.error(error.error.errors[key], '');
              }
            }
          } else {
            this.toastr.error('Ocorreu um erro ao realizar o cadastro.', '');
          }
        }
      );
    } else {
      this.toastr.error('Senha e Confirmação são obrigatórios.', '');
    }
  }

  deleteAccount() {
    if(this.profileForm.valid) {
      this.userService.delete().subscribe(
        (response) => {
          localStorage.removeItem('token');
          this.router.navigate(['/user']);
          this.toastr.success('Perfil excluido com sucesso', '');
        },
        (error) => {
          this.toastr.error('Erro ao excluir usuário.', '');
        }
      )
    } else {
      this.toastr.error('Senha e Confirmação são obrigatórios.', '');
    }
  }
}
