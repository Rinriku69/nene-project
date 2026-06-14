import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/AuthModel';
import { HttpClient } from '@angular/common/http';
import { filterTerm, FullGachaItem, GachaItem, PaginationResponse, ResourceResponse, UserResource } from '../models/Resource';
import { UpdateUserForm } from '../pages/admin/user-management/user-management';



@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly baseApiUrl = "http://localhost:8000/api/admin"
  private readonly http = inject(HttpClient);

  getUserList(term:filterTerm): Observable<PaginationResponse<UserResource>>{
    return this.http.get<PaginationResponse<UserResource>>(`${this.baseApiUrl}/getUserList?search=${term.search ?? ''}&role=${term.role ?? ''}`);
  }

  updateUser(user:UpdateUserForm):Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/updateUser/${user.id}`,user)
  }

  getAllItems(): Observable<FullGachaItem[]>{
    return this.http.get<FullGachaItem[]>(`${this.baseApiUrl}/getAllItems`)
  }

  updateItem(itemForm: FullGachaItem): Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/updateItem`,itemForm)
  }

  addItem(itemForm: FullGachaItem): Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/addItem`,itemForm)
  }

}
