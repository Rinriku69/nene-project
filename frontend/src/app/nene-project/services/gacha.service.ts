import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GachaResponse, PaginationResponse, GachaLog, FeatureBanner } from '../models/Resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GachaService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = 'http://localhost:8000/api/gacha';

  featureBanner = httpResource<FeatureBanner[]>(() => ({ url: `${this.baseApiUrl}/getFeatureBanner` }));
  gachaRoll(pulls: number): Observable<GachaResponse> {
    return this.http.post<GachaResponse>(`${this.baseApiUrl}/pull`, { pull: pulls });
  }

  getGachaLogs(page: number = 1): Observable<PaginationResponse<GachaLog>> {
    let params = new HttpParams().set('page', page);
    return this.http.get<PaginationResponse<GachaLog>>(`${this.baseApiUrl}/logs`, { params });
  }
}
