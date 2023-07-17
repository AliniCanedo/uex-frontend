import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';

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
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/user']);
        this.toastr.error('Faça o login novamente.', '');
      }
    );
  } 

  onSubmit() {
    if(this.profileForm.valid) {
      const user: User = {
        name: this.profileForm.get('name')?.value,
        email: this.profileForm.get('email')?.value,
        password: this.profileForm.get('password')?.value,
        password_confirmation: this.profileForm.get('password_confirmation')?.value
      }

      this.userService.update(user).subscribe(
        () => {
          this.toastr.success('Cadastro atualizado com sucesso.', '');
          this.router.navigate(['/profile']);
        },
        (error) => {
          if (error.error && error.error.errors && typeof error.error.errors === 'object') {
            for (var key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                this.toastr.error(error.error.errors[key], '');
              }
            }
          } else {
            this.toastr.error('Ocorreu um erro ao atualizar.', '');
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
        () => {
          localStorage.removeItem('token');
          this.router.navigate(['/user']);
          this.toastr.success('Perfil excluido com sucesso', '');
        },
        () => {
          this.toastr.error('Erro ao excluir usuário.', '');
        }
      )
    } else {
      this.toastr.error('Senha e Confirmação são obrigatórios.', '');
    }
  }
}
