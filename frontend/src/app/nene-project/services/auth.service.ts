import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LoginModel, RegisterModel, User } from '../models/AuthModel';
import { ResourceResponse } from '../models/Resource';
import co from '@angular/common/locales/co';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = "http://localhost:8000/api";
  private readonly currentUser = signal<User|null>(null);
  readonly currentUserState = computed(()=>this.currentUser());
  readonly isLoggedIn = computed(()=> this.currentUser()!== null);

  getCSRFToken():Observable<ResourceResponse>{
    return this.http.get<ResourceResponse>("http://localhost:8000/sanctum/csrf-cookie");
  }

  register(registerFormData: RegisterModel):Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/auth/register`,registerFormData);
  }

  login(credentials:LoginModel):Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/auth/login`,credentials);
  }

  getUser():Observable<User>{
    return this.http.get<User>(`${this.baseApiUrl}/getUser`).pipe(
      tap((user)=>{ this.currentUser.set(user)})
    )
  }

  logout():Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/auth/logout`,{}).pipe(
      tap(()=>this.currentUser.set(null))
    )
  }

  hydrateAuthState(){
    return this.getUser().pipe(
      catchError(()=>{
        this.currentUser.set(null);
        return of(null);
      })
    )
  }
}
