import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SakuraComponent } from '../../../components/sakura-component/sakura-component';
import { SafeZoneModel } from '../../../models/FormModel';
import { form, FormField, required } from '@angular/forms/signals';
import { AuthService } from '../../../services/auth.service';
import { SafeZoneService } from '../../../services/safe-zone.service';
import { ResourceErrorResponse } from '../../../models/Resource';

@Component({
  selector: 'app-safe-zone',
  imports: [SakuraComponent, FormField],
  templateUrl: './safe-zone.html',
  styleUrl: './safe-zone.css',
})
export class SafeZone {
  sakuraImg = viewChild<ElementRef>('sakuraImg');
  private readonly authService = inject(AuthService);
  private readonly safeZoneService = inject(SafeZoneService);

  protected readonly currentUser = computed(() => this.authService.currentUserState());
  readonly modalIsOpen = signal<boolean>(false);
  readonly isPlacementMode = signal<boolean>(false);
  readonly isShownTanzaku = signal<boolean>(false);

  readonly ghostX = signal(20);
  readonly ghostY = signal(0);

  readonly color = signal<string>('pink');

  readonly isSecret = signal<boolean>(false);

  readonly isConfirm = signal<boolean>(false);

  readonly messageModel = signal<SafeZoneModel>({
    message: '',
    theme_color: 'pink',
    pos_x: 0,
    pos_y: 0,
    unlocked_at: null,
  });

  protected readonly messageForm = form(this.messageModel, (path) => {
    required(path.message, { message: 'Please write down your wish' });
  });

  closeModal(): void {
    this.modalIsOpen.set(false);
    this.messageModel.set({ message: '', theme_color: 'pink', pos_x: 0, pos_y: 0, unlocked_at: null });
    this.isSecret.set(false);
    this.isShownTanzaku.set(false);
  }

  addWishClick(): void {
    this.modalIsOpen.set(false);
    this.isPlacementMode.set(true);
    this.isShownTanzaku.set(true);
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

  placeTanzaku(event: MouseEvent) {
    if (!this.isPlacementMode()) return;
    this.isPlacementMode.set(false);
    this.isConfirm.set(true);
    const rect: DOMRect = this.sakuraImg()?.nativeElement.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    this.messageModel.update((v) => ({ ...v, pos_x: xPercent, pos_y: yPercent }));
  }

  cancelPlacement() {
    this.isPlacementMode.set(true);
  }

  confirmPlacement(){
    this.isConfirm.set(false);
    this.safeZoneService.addTanzaku(this.messageForm().value()).subscribe({
      next: (res)=>{
        console.log(res.message)

      },
      error:(err:ResourceErrorResponse)=>{
        console.log(err.message)
      }
    })
  }

  getTanzakuColorClasses(): string {
    const color = this.messageModel().theme_color || 'pink';
    switch (color) {
      case 'yellow': return 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-[0_0_15px_#fef08a]';
      case 'blue': return 'bg-blue-100 border-blue-300 text-blue-800 shadow-[0_0_15px_#bfdbfe]';
      case 'red': return 'bg-red-100 border-red-300 text-red-800 shadow-[0_0_15px_#fecaca]';
      case 'purple': return 'bg-purple-100 border-purple-300 text-purple-800 shadow-[0_0_15px_#e9d5ff]';
      case 'green': return 'bg-green-100 border-green-300 text-green-800 shadow-[0_0_15px_#bbf7d0]';
      case 'pink':
      default:
        return 'bg-pink-100 border-pink-300 text-pink-800 shadow-[0_0_15px_#fbcfe8]';
    }
  }
}
