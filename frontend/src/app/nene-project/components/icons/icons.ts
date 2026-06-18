import { Component, input, InputSignal, Signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icons',
  imports: [],
  templateUrl: './icons.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './icons.css',
})
export class Icons {
  name: InputSignal<string> = input.required<string>();
  classAttribute = input('');
}
