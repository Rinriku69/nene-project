import { Component, input, InputSignal, Signal } from '@angular/core';

@Component({
  selector: 'app-icons',
  imports: [],
  templateUrl: './icons.html',
  styleUrl: './icons.css',
})
export class Icons {
  name: InputSignal<string> = input.required<string>();
  classAttribute = input('');
}
