import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { authGuard } from './core/guard/auth.guard';
import { ViewPortfolioComponent } from './components/view-portfolio/view-portfolio.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [authGuard],
  },
  // 👇 Publicly shareable portfolio route (no header)
  {
    path: 'user/portfolio/:userId',
    component: ViewPortfolioComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
