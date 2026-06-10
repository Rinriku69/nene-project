import { Routes } from '@angular/router';
import { Dashboard } from './pages/app/dashboard/dashboard';
import { MainLayout } from './pages/app/main-layout/main-layout';
import { authGuard, roleGuard } from '../guards/auth.guard';

export default [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'app',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () => import('./pages/app/dashboard/dashboard').then((m) => m.Dashboard),
            canMatch: [authGuard],
          },
          {
            path: 'gacha',
            loadComponent: () => import('./pages/app/gacha/gacha').then((m) => m.Gacha),
            canMatch: [authGuard],
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'userManagement',
            loadComponent: () =>
              import('./pages/admin/user-management/user-management').then((m) => m.UserManagement),
            canMatch: [roleGuard(['admin'])],
          },
          {
            path: 'gachaManagement',
            loadComponent: () =>
              import('./pages/admin/gacha-management/gacha-management').then(
                (m) => m.GachaManagement,
              ),
            canMatch: [roleGuard(['admin'])],
          },
        ],
      },
    ],
  },
] as Routes;
