import { Routes } from '@angular/router';
import { Home } from './nene-project/pages/home/home';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home',component:Home}
];
