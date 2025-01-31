import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../app/modules/auth/auth.routes').then(r => r.authRoutes)
    },

];
