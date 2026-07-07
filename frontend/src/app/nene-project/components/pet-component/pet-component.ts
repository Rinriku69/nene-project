import { Component, computed, input, signal } from '@angular/core';
import { PetAnimation, UserPet } from '../../models/Resource';

@Component({
  selector: 'app-pet-component',
  imports: [],
  templateUrl: './pet-component.html',
  styleUrl: './pet-component.css',
})
export class PetComponent {
  readonly pet = input.required<UserPet>();
  readonly animationName = input<string>('idle1');
  readonly type = input.required<string>();
  readonly defaultScale = signal<string>('100%');
  protected readonly currentAnimation = computed<PetAnimation | null>(() => {
    const animationName = this.animationName();
    const pet = this.pet();
    const animation = pet.pet_animations.map(({scale_box,scale_pet,...rest})=>({...rest, scale_box:`${scale_box}%`,scale_pet:`${scale_pet}%`})).find((v,i)=> v.name === animationName)
    return animation ? animation : null
  });
}
