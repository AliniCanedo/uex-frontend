import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoadingData: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],      
      password_confirmation: ['', Validators.required]
    });
  }

  onSubmit() {
    if(this.registerForm.valid) {
      this.isLoadingData = true;
      const user: User = {
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        password_confirmation: this.registerForm.get('password_confirmation')?.value
      }

      this.userService.register(user).subscribe(
        () => {
          this.isLoadingData = false;
          this.toastr.success('Cadastro efetuado com sucesso.', '');
          this.registerForm.reset();
        },
        (error) => {
          this.isLoadingData = false;
          if (error.error && error.error.errors && typeof error.error.errors === 'object') {
            for (var key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                this.toastr.error(error.error.errors[key], '');
              }
            }
          } else {
            this.isLoadingData = false;
            this.toastr.error('Ocorreu um erro ao realizar o cadastro.', '');
          }
        }
      );
    }
  }
}
