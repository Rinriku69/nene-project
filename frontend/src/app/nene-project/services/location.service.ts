import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResource, PositionUpdate, ResourceResponse } from '../models/Resource';

const BASE_API_URL = 'http://localhost:8000/api';
@Service()
export class LocationService {
    private readonly http = inject(HttpClient);
    
    getFriendLocation():Observable<LocationResource>{
        return this.http.get<LocationResource>(`${BASE_API_URL}/location/getFriendLocation`);
    }

    updatePosition(position: PositionUpdate):Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`${BASE_API_URL}/location/update`,position);
    }
}
