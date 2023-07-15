import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private toastr: ToastrService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.userService.login(email, password).subscribe(
        (response) => {
          this.router.navigate(['/contacts']);
          this.toastr.success('Login efetuado com sucesso.', '');
        },
        (error) => {
          this.toastr.error('Ocorreu um erro ao fazer o login.', '');
        }
      );
    } else {
      
    }
  }
}
