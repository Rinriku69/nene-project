import { Component, signal } from '@angular/core';
import { SakuraComponent } from '../../../components/sakura-component/sakura-component';

@Component({
  selector: 'app-safe-zone',
  imports: [SakuraComponent],
  templateUrl: './safe-zone.html',
  styleUrl: './safe-zone.css',
})
export class SafeZone {

  modalIsOpen = signal<boolean>(false);
  
}
