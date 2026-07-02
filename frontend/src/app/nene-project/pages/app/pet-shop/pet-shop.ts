import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { PetService } from '../../../services/pet.service';
import { PetComponent } from '../../../components/pet-component/pet-component';
import { PetShopResource, ResourceErrorResponse } from '../../../models/Resource';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pet-shop',
  imports: [PetComponent],
  templateUrl: './pet-shop.html',
  styleUrl: './pet-shop.css',
})
export class PetShop implements OnInit {
  private readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);
  protected readonly currentPetShop = computed(()=>this.petService.currentPetShop());
  private readonly currentUser = this.authService.currentUserState;
  protected readonly hoveredPetId = signal<number | null>(null);
  protected readonly message = signal<string | null>(null);

  onBuy(pet: PetShopResource){

    if(this.currentUser()?.currency! < pet.price){
      this.message.set('Insufficient Currency !')
      return
    }
    this.currentPetShop().value()!.map((v)=>v.id === pet.id ? v.is_owned = true : v)
    this.currentUser.update((v)=>{
      if(!v) return null
      const newV = {...v,currency: v.currency - pet.price}

      return newV
    })
    this.petService.buyPet(pet.id).subscribe({
      next: (res)=>{
      },
      error: (er: ResourceErrorResponse)=>{
        this.message.set(er.message);
      }
    })
  }
  ngOnInit() {
    this.petService.loadPetShop.set(true);
    if(!this.currentPetShop().value()){
      this.currentPetShop().reload();
    }
  }
}
