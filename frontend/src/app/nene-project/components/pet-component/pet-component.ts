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
  protected readonly currentAnimation = computed<PetAnimation | null>(() => {
    const animationName = this.animationName();
    const pet = this.pet();
    const animation = pet.pet_animations.map(({scale,...rest})=>({...rest, scale:scale ? `${scale}%` : null})).find((v,i)=> v.name === animationName)
    return animation ? animation : null
  });
  defaultScale = signal<string>('200%');
}
