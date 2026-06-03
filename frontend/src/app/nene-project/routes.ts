import { Routes } from "@angular/router";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { MainLayout } from "./pages/app/main-layout/main-layout";

export default [
    {path:'',component:MainLayout,
        children:[
            {path:'',redirectTo:'dashboard',pathMatch:'full'},
            {path:'dashboard',component:Dashboard}
        ]
    },

]as Routes