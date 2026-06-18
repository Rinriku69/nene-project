import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { GachaItem } from '../../models/Resource';

@Component({
  selector: 'app-item-result-component',
  imports: [],
  templateUrl: './item-result-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './item-result-component.css',
})
export class ItemResultComponent {
  item = input.required<GachaItem>();
  selectedItem = output<GachaItem>();
  classAttribute = input<string>('');

  viewItem(item: GachaItem): void {
    this.selectedItem.emit(item);
  }
}
