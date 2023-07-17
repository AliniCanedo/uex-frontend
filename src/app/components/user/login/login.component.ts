import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoadingData: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private toastr: ToastrService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoadingData = true;

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      const user: User = {
        email,
        password
      }

      this.userService.login(user).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.current_user.name);
          this.router.navigate(['/contacts']);
          this.toastr.success('Login efetuado com sucesso.', '');
        },
        (error) => {          
          this.isLoadingData = false;
          if (error.error && error.error.errors) {
            this.toastr.error(error.error.errors, '');
            this.isLoadingData = false;
          } else {
            this.toastr.error('Ocorreu um erro ao fazer o login.', '');
          }
        },
        () => {
          this.isLoadingData = false;
        }
      );
    }
  }
}
