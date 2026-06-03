import { Routes } from '@angular/router';
import { Home } from './nene-project/pages/home/home';
import { Dashboard } from './nene-project/pages/dashboard/dashboard';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home',component:Home},
    {path:'dashboard',component:Dashboard}
];
