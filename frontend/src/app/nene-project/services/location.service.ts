import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLocationResource, ResourceResponse, UserLocation } from '../models/Resource';

const BASE_API_URL = 'http://localhost:8000/api';
@Service()
export class LocationService {
    private readonly http = inject(HttpClient);
    
    getFriendLocation():Observable<UserLocationResource[]>{
        return this.http.get<UserLocationResource[]>(`${BASE_API_URL}/location/getFriendLocation`);
    }

    updatePosition(position: UserLocation):Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`${BASE_API_URL}/location/update`,position);
    }
}
