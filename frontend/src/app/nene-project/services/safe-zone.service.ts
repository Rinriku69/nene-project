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
    return this.http.post<ResourceResponse>(`http://localhost:8000/api/safezone/addTanzaku`,tanzakuForm);
  }

  getMessages():Observable<SafeZoneResponse[]>{
    return this.http.get<SafeZoneResponse[]>(`http://localhost:8000/api/safezone/getMessages`);
  }
}
