import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/calculator/calculator.component').then(
        com => com.CalculatorComponent
      ),
    title: 'DNA | Home',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/components/auth/auth.component').then(
        com => com.AuthComponent
      ),
    title: 'DNA | Login',
  },
  {
    path: 'test-builtin',
    loadComponent: () =>
      import('./pages/test-builtin/test-builtin.component').then(
        com => com.TestBuiltinComponent
      ),
    title: 'DNA | Login',
  },
];
