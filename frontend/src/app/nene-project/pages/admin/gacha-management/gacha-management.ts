import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { form, FormField, required, min } from '@angular/forms/signals';
import { Icons } from '../../../components/icons/icons';
import { AdminService } from '../../../services/admin.service';
import { FullGachaItem } from '../../../models/Resource';
import { registerAppScopedDispatcher } from '@angular/core/primitives/event-dispatch';

@Component({
  selector: 'app-gacha-management',
  imports: [FormField, Icons],
  templateUrl: './gacha-management.html',
  styleUrl: './gacha-management.css',
})
export class GachaManagement implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly items = signal<FullGachaItem[]>([]);

  protected readonly isAddModalOpen = signal(false);
  protected readonly isEditModalOpen = signal(false);
  protected readonly currentEditId = signal<number | null>(null);

  private readonly itemModel: WritableSignal<FullGachaItem> = signal({
    id: 1,
    name: '',
    description: '',
    rarity: 'N',
    url: '',
    weight: 1,
  });

  protected readonly itemForm = form(this.itemModel, (path) => {
    required(path.name, { message: 'Name is required' });
    required(path.description, { message: 'Description is required' });
    required(path.rarity, { message: 'Rarity is required' });
    required(path.url, { message: 'URL is required' });
    required(path.weight, { message: 'Weight is required' });
    min(path.weight, 1, { message: 'Weight must be at least 1' });
  });

  protected openAddModal() {
    this.itemModel.set({
      id: 1,
      name: '',
      description: '',
      rarity: 'N',
      url: '',
      weight: 1,
    });
    this.isAddModalOpen.set(true);
  }

  protected closeAddModal() {
    this.isAddModalOpen.set(false);
  }

  protected openEditModal(item: FullGachaItem) {
    this.currentEditId.set(item.id!);
    this.itemModel.set({
      id: item.id,
      name: item.name,
      description: item.description,
      rarity: item.rarity,
      url: item.url,
      weight: item.weight,
    });
    this.isEditModalOpen.set(true);
  }

  protected closeEditModal() {
    this.isEditModalOpen.set(false);
    this.currentEditId.set(null);
  }

  protected submitAdd() {
    if (this.itemForm().invalid()) return;
    this.adminService.addItem(this.itemForm().value()).subscribe({
      next: (res) => {
        console.log(res.message);
        this.adminService.getAllItems().subscribe({
          next: (res) => {
            this.items.set(res);
          },
        });
      },
    });
    this.closeAddModal();
  }

  protected submitEdit() {
    if (this.itemForm().invalid()) return;
    const currentId = this.currentEditId();
    if (currentId === null) return;

    this.adminService.updateItem(this.itemForm().value()).subscribe({
      next: (res) => {
        console.log(res.message);
        this.adminService.getAllItems().subscribe({
          next: (res) => {
            this.items.set(res);
          },
        });
      },
    });
    this.closeEditModal();
  }

  ngOnInit() {
    this.adminService.getAllItems().subscribe({
      next: (res) => {
        this.items.set(res);
      },
    });
  }
}
