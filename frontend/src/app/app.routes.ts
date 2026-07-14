import { Routes } from '@angular/router';
import { Home } from './nene-project/pages/home/home';

import { Login } from './nene-project/pages/auth/login/login';
import { Register } from './nene-project/pages/auth/register/register';
import { redirectAuth } from './guards/auth.guard';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home',component:Home},
    {path:'auth',children:[
        {path:'login',component:Login, canActivate:[redirectAuth]},
        {path:'register',component:Register, canActivate:[redirectAuth]},
        {path:'token-login',loadComponent:()=>import('./nene-project/pages/token-login/token-login').then((m)=>m.TokenLogin)}
    ]},
    {path:'', loadChildren:()=> import('./nene-project/routes')}
];
