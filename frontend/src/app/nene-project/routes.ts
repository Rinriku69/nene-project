import { Routes } from "@angular/router";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { MainLayout } from "./pages/app/main-layout/main-layout";
import { roleGuard } from "../guards/auth.guard";

export default [
    {path:'',component:MainLayout,
        children:[
            {path:'',redirectTo:'dashboard',pathMatch:'full'},
            {path:'dashboard',component:Dashboard},
            // {path:'',loadComponent:() => import('./abc/abc.component').then(m=>m.AbcComponent),canMatch:[roleGuard(['admin'])]}
        ]
    },

]as Routes