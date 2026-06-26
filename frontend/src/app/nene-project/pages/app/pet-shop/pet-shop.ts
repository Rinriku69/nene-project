import { Component, inject, OnInit } from '@angular/core';
import { PetService } from '../../../services/pet.service';
import { PetComponent } from "../../../components/pet-component/pet-component";
import { Icons } from '../../../components/icons/icons';

@Component({
  selector: 'app-pet-shop',
  imports: [PetComponent, Icons],
  templateUrl: './pet-shop.html',
  styleUrl: './pet-shop.css',
})

export class PetShop implements OnInit {
  private readonly petService = inject(PetService);
  protected readonly currentPetShop = this.petService.currentPetShop()

 ngOnInit(){
  this.currentPetShop.reload();
 }
}
