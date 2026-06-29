import { computed, inject, Service, signal } from '@angular/core';
import { PetAnimation, PetShopResource, ResourceResponse, UserPet } from '../models/Resource';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { clearPetIdLocalStorage, getPetIdLocalStorage, setPetIdLocalStorage } from '../helpers';
const KEY_PREFIX = 'nene-project';
const PET_ID_KEY = 'petId';
@Service()
export class PetService {
    private readonly http = inject(HttpClient);
    private readonly petId = signal<number|null>(null);
    readonly currentPetId = computed(()=>this.petId());
    readonly trigger = signal<number>(0);
    private readonly currentUserPetResource = httpResource<UserPet>(()=>({
        url:`http://localhost:8000/api/pet/getUserPet/${this.petId()}`,
        method: 'GET' 
        })
    )
    private readonly petShop = httpResource<PetShopResource[]>(()=>({
     url:'http://localhost:8000/api/pet/getPetShop',
    }))
    
    private readonly allUserPet = httpResource<PetShopResource[]>(()=>({
     url:'http://localhost:8000/api/pet/getAllUserPets',
    }))

    readonly currentUserPet = computed(()=>this.currentUserPetResource)
    readonly currentPetShop = computed(()=>this.petShop);
    readonly currentAllUserPets = computed(()=>this.allUserPet);

    buyPet(id:number): Observable<ResourceResponse>{
        return this.http.post<ResourceResponse>(`http://localhost:8000/api/pet/buyPet/${id}`,{})
    }

    async getCurrentPetId(){
        this.petId.set(await getPetIdLocalStorage(`${KEY_PREFIX}-${PET_ID_KEY}`))
    }

    equipPet(id: number){
        
        setPetIdLocalStorage(`${KEY_PREFIX}-${PET_ID_KEY}`,id);
    }

    clearPetId(){
        clearPetIdLocalStorage(`${KEY_PREFIX}-${PET_ID_KEY}`);
        this.getCurrentPetId();
    }

}
