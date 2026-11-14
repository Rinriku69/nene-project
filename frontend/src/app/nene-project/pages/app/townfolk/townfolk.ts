import { Component } from '@angular/core';
import { CharacterComponent } from '../../../components/character-component/character-component';
import { Character } from '../../../models/Resource';

@Component({
  selector: 'app-townfolk',
  imports: [CharacterComponent],
  templateUrl: './townfolk.html',
  styleUrl: './townfolk.css',
})
export class Townfolk {
  characters: Character[] = [
    {
      name: 'reze',
      animation: 'walk_down',
    },
  ];
}
