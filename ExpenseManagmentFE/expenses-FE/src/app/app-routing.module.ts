import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CheckEmailComponent } from './pages/auth/check-email/check-email.component';
import { EmailConfirmedComponent } from './pages/auth/email-confirmed/email-confirmed.component';
import { homeGuard } from './guards/home.guard';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [homeGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [homeGuard] },
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
