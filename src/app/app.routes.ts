import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkshopComponent } from './pages/admin/workshop/workshop.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { ParticipantLayoutComponent } from './pages/participant/participant-layout.component';
import { WorkshopTableComponent } from './components/workshop-table/workshop-table.component';
import { TrainerLayoutComponent } from './pages/trainer/trainer-layout/trainer-layout.component';
import { AuthRoleGuard } from './core/guards/auth-role.guard';

export const routes: Routes = [
  {
    path: '',
    component: WorkshopComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthRoleGuard],
    data: { role: 'admin' },
    children: [
      { path: 'workshops', component: WorkshopComponent },
      { path: 'users', component: UsersComponent },
      { path: '', redirectTo: 'workshops', pathMatch: 'full' }
    ]
  },
  {
    path: 'participant',
    component: ParticipantLayoutComponent,
    canActivate: [AuthRoleGuard],
    data: { role: 'participant' },
    children: [
      { path: 'my-workshops', component: WorkshopTableComponent },
      { path: '', redirectTo: 'my-workshops', pathMatch: 'full' }
    ]
  },
  {
    path: 'trainer',
    component: TrainerLayoutComponent,
    canActivate: [AuthRoleGuard],
    data: { role: 'trainer' },
    children: [
      { path: 'my-workshops', component: WorkshopTableComponent },
      { path: '', redirectTo: 'my-workshops', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: '' // fallback to home
  }
];
