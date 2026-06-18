import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { GachaItem, InventoryItem, PaginationResponse } from '../../../models/Resource';
import { ItemViewComponent } from '../../../components/item-view-component/item-view-component';

@Component({
  selector: 'app-inventory',
  imports: [ItemViewComponent],
  templateUrl: './inventory.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inventory.css',
})
export class Inventory {
  private readonly inventoryService = inject(InventoryService);
  protected readonly Array = Array;

  selectedItem = signal<GachaItem | null>(null);
  inventoryData = signal<PaginationResponse<InventoryItem> | null>(null);
  isLoading = signal<boolean>(false);

  viewImage(item: GachaItem): void {
    this.selectedItem.set(item);
  }

  closeItem(): void {
    this.selectedItem.set(null);
  }

  ngOnInit() {
    this.fetchInventory(1);
  }

  fetchInventory(page: number) {
    this.isLoading.set(true);
    this.inventoryService.getInventory(page).subscribe({
      next: (response) => {
        this.inventoryData.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      },
    });
  }

  changePage(page: number) {
    if (this.inventoryData()) {
      const maxPage = this.inventoryData()!.last_page;
      if (page >= 1 && page <= maxPage) {
        this.fetchInventory(page);
      }
    }
  }
}
