import { Component, input } from '@angular/core';
import { PetAnimation } from '../../models/Resource';

@Component({
  selector: 'app-pet-component',
  imports: [],
  templateUrl: './pet-component.html',
  styleUrl: './pet-component.css',
})
export class PetComponent {
  readonly petUrl = input.required<string>();
  readonly petAnimateVar = input.required<PetAnimation>();
}
