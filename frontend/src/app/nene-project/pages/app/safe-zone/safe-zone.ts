import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { SakuraComponent } from '../../../components/sakura-component/sakura-component';
import { SafeZoneModel } from '../../../models/FormModel';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-safe-zone',
  imports: [SakuraComponent, FormField],
  templateUrl: './safe-zone.html',
  styleUrl: './safe-zone.css',
})
export class SafeZone {
  sakuraImg = viewChild<ElementRef>('sakuraImg');

  readonly modalIsOpen = signal<boolean>(false);
  readonly isPlacementMode = signal<boolean>(false);

  readonly ghostX = signal(20);
  readonly ghostY = signal(0);

  readonly isSecret = signal<boolean>(false);

  readonly messageModel = signal<SafeZoneModel>({
    message: '',
    unlocked_at: null,
  });

  protected readonly messageForm = form(this.messageModel, (path) => {
    required(path.message);
  });

  closeModal(): void {
    this.modalIsOpen.set(false);
    this.messageModel.set({ message: '', unlocked_at: null });
    this.isSecret.set(false);
  }

  openModal(): void {
    this.modalIsOpen.set(true);
  }

  updateGhostPosition(event: MouseEvent) {
    if (!this.isPlacementMode()) return;
    const rect: DOMRect = this.sakuraImg()?.nativeElement.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    this.ghostX.set(xPercent);
    this.ghostY.set(yPercent);
  }

  togglePlacementMode() {
    this.isPlacementMode.set(!this.isPlacementMode());
  }
}
