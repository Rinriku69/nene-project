import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { GachaItem } from '../../models/Resource';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-item-view-component',
  imports: [Icons],
  templateUrl: './item-view-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './item-view-component.css',
})
export class ItemViewComponent {
  selectedItem = input.required<GachaItem | null>();
  classAttribute = input.required<string>();
  close = output<void>();

  closeItem() {
    this.close.emit();
  }
}
