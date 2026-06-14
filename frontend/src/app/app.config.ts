import {  ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { xsrfInterceptor } from './interceptors/xsrf.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { AuthService } from './nene-project/services/auth.service';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([xsrfInterceptor,loadingInterceptor])),
    provideAppInitializer(()=>{
      const authService = inject(AuthService);
      
      return authService.hydrateAuthState();
    })
  ]
};
