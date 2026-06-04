import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/AuthModel';
import { ResourceResponse } from '../models/Resource';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = "http://localhost:8000/api/auth";

  getCSRFToken():Observable<ResourceResponse>{
    return this.http.get<ResourceResponse>("http://localhost:8000/sanctum/csrf-cookie");
  }

  register(registerFormData: RegisterModel):Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/register`,registerFormData)
  }
}
