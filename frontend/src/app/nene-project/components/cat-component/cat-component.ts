import { Component, input } from '@angular/core';
import { CatSpriteAnimate } from '../../models/Resource';

@Component({
  selector: 'app-cat-component',
  imports: [],
  templateUrl: './cat-component.html',
  styleUrl: './cat-component.css',
})
export class CatComponent {
  readonly catUrl = input.required<string>();
  readonly catAnimateVar = input.required<CatSpriteAnimate>();

}
