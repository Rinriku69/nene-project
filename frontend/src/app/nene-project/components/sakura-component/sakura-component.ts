import { Component } from '@angular/core';

@Component({
  selector: 'app-sakura-component',
  imports: [],
  templateUrl: './sakura-component.html',
  styleUrl: './sakura-component.css',
})
export class SakuraComponent {
  petals = Array.from({ length: 10 }, () => ({
    x: Math.floor(Math.random() * 100),
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4 
  }));
}
