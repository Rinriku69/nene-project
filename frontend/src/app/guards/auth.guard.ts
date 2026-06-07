import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../nene-project/services/auth.service";


export const authGuard: CanActivateFn = (route, state)=>{
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if(authService.isLoggedIn()){
        return true
    }

    return router.parseUrl('/auth/login')
}

export const roleGuard = (allowedRoles: string[]):CanActivateFn =>{
    return (route,state) =>{
        const authService = inject(AuthService);
        const router = inject(Router);

        const user = authService.currentUserState();

        if(user && allowedRoles.includes(user.role)){
            return true
        }
        
        return router.parseUrl('/')
    }
}