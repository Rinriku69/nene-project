import { Routes } from '@angular/router';
import { Home } from './nene-project/pages/home/home';

import { Login } from './nene-project/pages/auth/login/login';
import { Register } from './nene-project/pages/auth/register/register';
import { redirectAuth } from './guards/auth.guard';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'auth',children:[
        {path:'login',component:Login, canActivate:[redirectAuth]},
        {path:'register',component:Register, canActivate:[redirectAuth]},
        {path:'token-login',loadComponent:()=>import('./nene-project/pages/token-login/token-login').then((m)=>m.TokenLogin)},
        {path:'forgotPassword',loadComponent:()=>import('./nene-project/pages/auth/forgot-password/forgot-password').then((m)=>m.ForgotPassword)},
        {path:'resetPassword',loadComponent:()=>import('./nene-project/pages/auth/reset-password/reset-password').then((m)=>m.ResetPassword)}
    ]},
    {path:'', loadChildren:()=> import('./nene-project/routes')}
];
