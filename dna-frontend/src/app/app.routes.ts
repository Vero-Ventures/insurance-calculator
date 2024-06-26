import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then(com => com.AuthComponent),
    title: 'DNA | Login',
  },
  {
    path: 'landing',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        com => com.LandingComponent
      ),
    title: 'DNA | Home',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then(
        com => com.SignupComponent
      ),
    title: 'DNA | Signup',
  },
  {
    path: 'client-list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/client-list/client-list.component').then(
        com => com.ClientListComponent
      ),
    title: 'DNA | Clients',
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./pages/test-page/test-page.component').then(
        com => com.TestPageComponent
      ),
    title: 'DNA | Test Page',
  },
  {
    path: 'client/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/client/client.component').then(
        com => com.ClientComponent
      ),
    title: 'DNA | Client',
  },
  {
    path: 'beneficiaries/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/beneficiaries/beneficiaries.component').then(
        com => com.BeneficiariesComponent
      ),
    title: 'DNA | Beneficiaries',
  },
  {
    path: 'businesses/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/businesses/businesses.component').then(
        com => com.BusinessesComponent
      ),
    title: 'DNA | Businesses',
  },
  {
    path: 'business/:clientId/:businessId',
    loadComponent: () =>
      import('./pages/business-edit/business-edit.component').then(
        com => com.BusinessEditComponent
      ),
    title: 'DNA | Businesses',
  },
  {
    path: 'assets/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/assets/assets.component').then(
        com => com.AssetsComponent
      ),
    title: 'DNA | Assets',
  },
  {
    path: 'asset/:clientId/:assetId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/asset-edit/asset-edit.component').then(
        com => com.AssetEditComponent
      ),
    title: 'DNA | Assets',
  },
  {
    path: 'debts/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/debts/debts.component').then(com => com.DebtsComponent),
    title: 'DNA | Debts',
  },
  {
    path: 'debt/:clientId/:debtId',
    loadComponent: () =>
      import('./pages/debt-edit/debt-edit.component').then(
        com => com.DebtEditComponent
      ),
    title: 'DNA | Debts',
  },
  {
    path: 'goals/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/goals/goals.component').then(com => com.GoalsComponent),
    title: 'DNA | Goals',
  },
  {
    path: 'total-needs/:clientId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/total-needs/total-needs.component').then(
        com => com.TotalNeedsComponent
      ),
    title: 'DNA | Total Needs',
  },
  {
    path: 'advisor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/advisor/advisor.component').then(
        com => com.AdvisorComponent
      ),
    title: 'DNA | Robo-Advisor',
  },
];
