import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeZoneModel } from '../models/FormModel';
import { HttpClient } from '@angular/common/http';
import { ResourceResponse, SafeZoneResponse } from '../models/Resource';

@Injectable({
  providedIn: 'root',
})
export class SafeZoneService {
  private readonly http = inject(HttpClient);

  addTanzaku(tanzakuForm: SafeZoneModel):Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`/api/safezone/addTanzaku`,tanzakuForm);
  }

  getMessages(visibility: 'public' | 'private'):Observable<SafeZoneResponse[]>{
    return this.http.get<SafeZoneResponse[]>(`/api/safezone/getMessages`,{
      params: { visibility },
    });
  }
}
