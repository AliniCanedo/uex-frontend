import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ContactFormComponent } from './components/contacts/contact-form/contact-form.component';

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
  { path: 'contacts/new', component: ContactFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
