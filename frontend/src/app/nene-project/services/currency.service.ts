import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceResponse } from '../models/Resource';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly baseApiUrl = '/api';
  private readonly http = inject(HttpClient);

  getDailyLogin(): Observable<ResourceResponse>{
    return this.http.post<ResourceResponse>(`${this.baseApiUrl}/getDailyLogin`,{});
  }
}
