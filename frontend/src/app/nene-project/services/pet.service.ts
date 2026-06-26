import { computed, Service, signal } from '@angular/core';
import { PetAnimation, PetShop, UserPet } from '../models/Resource';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Service()
export class PetService {
    readonly petId = signal<number|null>(null);
    readonly trigger = signal<number>(0);
    private readonly petResource = httpResource<UserPet>(()=>({
        url:`http://localhost:8000/api/pet/getUserPet/${this.petId()}`,
        method: 'GET' 
        })
    )
    private readonly petShop = httpResource<PetShop[]>(()=>({
     url:'http://localhost:8000/api/pet/getPetShop',
    }))
    readonly currentUserPet = computed(()=>this.petResource)
    readonly currentPetShop = computed(()=>this.petShop);


}
