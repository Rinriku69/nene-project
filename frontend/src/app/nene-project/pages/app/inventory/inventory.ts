import { Component, inject, OnInit, signal } from '@angular/core';
import { InventoryItem, PaginationResponse } from '../../../models/Resource';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inventory.html',
})
export class Inventory implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  inventoryData = signal<PaginationResponse<InventoryItem> | null>(null);
  isLoading = signal<boolean>(false);

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
      }
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
