import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";

export const authRoutes: Routes = [

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
        loadComponent: () => import('../auth/components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
        title: 'Unauthorized',
    },

    {
        path: '**',
        loadComponent: () => import('../auth/components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),
        title: 'Page Not Found',
    }
];