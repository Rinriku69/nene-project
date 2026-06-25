import { Component, computed, input } from '@angular/core';
import { PetAnimation, UserPet } from '../../models/Resource';

@Component({
  selector: 'app-pet-component',
  imports: [],
  templateUrl: './pet-component.html',
  styleUrl: './pet-component.css',
})
export class PetComponent {
  readonly pet = input.required<UserPet>();
  readonly animationName = input<string>('idle');
  protected readonly currentAnimation = computed<PetAnimation | null>(() => {
    const animationName = this.animationName();
    const pet = this.pet();
    const animation = pet.pet_animations.find((v,i)=> v.name === animationName)
    return animation ? animation : null
  });
}
