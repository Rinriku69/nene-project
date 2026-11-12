import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileImage, ResourceResponse } from '../models/Resource';

@Service()
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly baseApiUrl = '/api/profile';

    uploadProfile(image: FormData):Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`${this.baseApiUrl}/uploadProfile`,image)
    }
}
