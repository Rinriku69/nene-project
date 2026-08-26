import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLocationResource, ResourceResponse, UserLocation } from '../models/Resource';

const BASE_API_URL = '/api';
@Service()
export class LocationService {
    private readonly http = inject(HttpClient);

    getFriendLocation():Observable<UserLocationResource[]>{
        return this.http.get<UserLocationResource[]>(`${BASE_API_URL}/location/getFriendLocation`);
    }

    getMyLocation():Observable<UserLocationResource|null>{
        return this.http.get<UserLocationResource|null>(`${BASE_API_URL}/location/getMyLocation`);
    }

    updatePosition(position: UserLocation):Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`${BASE_API_URL}/location/update`,position);
    }
}
