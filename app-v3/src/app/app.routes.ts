import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'auth/signup',
        loadComponent: () => import(
            './components/signup/signup.component'
        ).then((e) => {
            return e.SignupComponent;
        })
    }
];
