import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './helpers';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { AddEditComponent } from './component/add-edit/add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-employee',
    component: AddEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-employee/:id',
    component: AddEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee-detail/:id',
    component: AddEditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
