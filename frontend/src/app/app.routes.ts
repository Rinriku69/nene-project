import { Routes } from '@angular/router';
import { Home } from './nene-project/pages/home/home';

import { Login } from './nene-project/pages/auth/login/login';
import { Register } from './nene-project/pages/auth/register/register';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home',component:Home},
    {path:'auth',children:[
        {path:'login',component:Login},
        {path:'register',component:Register}
    ]},
    {path:'app', loadChildren:()=> import('./nene-project/routes')}
];
