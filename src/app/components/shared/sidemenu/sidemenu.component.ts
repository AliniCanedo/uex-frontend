import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent {

  constructor(private userService: UserService, 
              private toastr: ToastrService, 
              private router: Router) { }

  logout() {
    this.userService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/user']);
      },
      (error) => {
        this.toastr.error('Erro ao sair.', error);
      }
    );
  }
}
