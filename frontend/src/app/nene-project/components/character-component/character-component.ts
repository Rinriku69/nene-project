import { Component, effect, input, InputSignal } from '@angular/core';
import SheetProperty from '../../data/townfolk/manifest.json';
import { AnimationProperty, Character, SpriteSheetProperty } from '../../models/Resource';

@Component({
  selector: 'app-character-component',
  imports: [],
  templateUrl: './character-component.html',
  styleUrl: './character-component.css',
})
export class CharacterComponent {
  spriteSheet: SpriteSheetProperty = SheetProperty;
  animationFrame: Record<string, AnimationProperty> = SheetProperty.animations;
  character = input.required<Character>();
}
