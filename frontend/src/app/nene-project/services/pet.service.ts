import { computed, Service, signal } from '@angular/core';
import { PetAnimation, UserPet } from '../models/Resource';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Service()
export class PetService {
    readonly petId = signal<number|null>(null);
    private readonly petResource = httpResource<UserPet>(()=>({
        url:`/api/pet/getUserPet/${this.petId()}`,
        method: 'GET' 
        })
    )
    readonly currentUserPet = computed(()=>this.petResource)
}
