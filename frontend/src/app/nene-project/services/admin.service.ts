import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/AuthModel';
import { HttpClient } from '@angular/common/http';
import { PaginationResponse, UserResource } from '../models/Resource';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly baseApiUrl = "http://localhost:8000/api/admin"
  private readonly http = inject(HttpClient);

  getUserList(): Observable<PaginationResponse<UserResource>>{
    return this.http.get<PaginationResponse<UserResource>>(`${this.baseApiUrl}/getUserList`);
  }
}
