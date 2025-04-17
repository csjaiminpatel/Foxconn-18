import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
        title: 'Login'
    },

    {
        path: 'home',
        component: LoginComponent,
        title: 'Login'
    },

    {
        path: 'unauthorized',
        loadComponent: () => import('./modules/auth/components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
        title: 'Unauthorized',
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/components/material-management/material-management.routes').then(m => m.MATERIAL_MANAGEMENT_ROUTES),
    },
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./modules/dashboard/components/material-management/material-management/material-management.component').then(m => m.MaterialManagementComponent),
    //     title: 'dashboard',
    // }
];
