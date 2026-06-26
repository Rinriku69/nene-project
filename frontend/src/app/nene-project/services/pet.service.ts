import { computed, inject, Service, signal } from '@angular/core';
import { PetAnimation, PetShopResource, ResourceResponse, UserPet } from '../models/Resource';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class PetService {
    private readonly http = inject(HttpClient);
    readonly petId = signal<number|null>(null);
    readonly trigger = signal<number>(0);
    private readonly petResource = httpResource<UserPet>(()=>({
        url:`http://localhost:8000/api/pet/getUserPet/${this.petId()}`,
        method: 'GET' 
        })
    )
    private readonly petShop = httpResource<PetShopResource[]>(()=>({
     url:'http://localhost:8000/api/pet/getPetShop',
    }))
    readonly currentUserPet = computed(()=>this.petResource)
    readonly currentPetShop = computed(()=>this.petShop);

    buyPet(id:number): Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`http://localhost:8000/api/pet/buyPet/${id}`,{})
    }

}
