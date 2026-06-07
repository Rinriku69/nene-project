import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GachaResponse } from '../models/Resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GachaService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = 'http://localhost:8000/api/gacha';


  gachaRoll(pulls:number): Observable<GachaResponse>{
    return this.http.post<GachaResponse>(`${this.baseApiUrl}/pull`,{'pull':pulls})
  }

}
