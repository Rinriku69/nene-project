import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SakuraComponent } from '../../../components/sakura-component/sakura-component';
import { SafeZoneModel } from '../../../models/FormModel';
import { form, FormField, required } from '@angular/forms/signals';
import { AuthService } from '../../../services/auth.service';
import { SafeZoneService } from '../../../services/safe-zone.service';
import { ResourceErrorResponse, SafeZoneResponse } from '../../../models/Resource';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Icons } from "../../../components/icons/icons";
import { linkifyMessage } from '../../../helpers';

@Component({
  selector: 'app-safe-zone',
  imports: [SakuraComponent, FormField, UpperCasePipe, Icons],
  templateUrl: './safe-zone.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './safe-zone.css',
})
export class SafeZone implements OnInit {
  sakuraImg = viewChild<ElementRef>('sakuraImg');
  private readonly authService = inject(AuthService);
  private readonly safeZoneService = inject(SafeZoneService);
  private readonly datePipe = new DatePipe('en-US');
  protected readonly safeZoneMessages = signal<SafeZoneResponse[] | null>(null);

  protected readonly currentUser = computed(() => this.authService.currentUserState());
  readonly modalIsOpen = signal<boolean>(false);
  readonly viewModalIsOpen = signal<boolean>(false);
  readonly selectedTanzaku = signal<SafeZoneResponse | null>(null);
  protected readonly messageSegments = computed(() =>
    linkifyMessage(this.selectedTanzaku()?.message ?? ''),
  );

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
    this.messageModel.set({
      message: '',
      theme_color: 'pink',
      pos_x: 0,
      pos_y: 0,
      unlocked_at: null,
    });
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
    this.isConfirm.set(false);
  }

  updateGhostPosition(event: MouseEvent) {
    if (!this.isPlacementMode()) return;
    const rect: DOMRect = this.sakuraImg()?.nativeElement.getBoundingClientRect();
    console.log(this.sakuraImg()?.nativeElement);
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
    this.isConfirm.set(false);
  }

  confirmPlacement() {
    this.isConfirm.set(false);
    const messageTranform = {
      ...this.messageForm().value(),
      unlocked_at: this.messageForm().value().unlocked_at
        ? this.datePipe.transform(this.messageForm().value().unlocked_at, 'yyyy-MM-dd')
        : null,
    };
    this.safeZoneService.addTanzaku(messageTranform).subscribe({
      next: (res) => {
        console.log(res.message);
      },
      error: (err: ResourceErrorResponse) => {
        if (err.status === 403) {
          alert('Please verify your email before leaving a tanzaku! Use the resend button in the pink banner.');
          return;
        }
        alert("Error occured, Try again later");
      },
    });
  }

  getTanzakuColorClasses(): string {
    return this.getColorForTanzaku(this.messageModel().theme_color || 'pink', false);
  }

  getColorForTanzaku(color: string, isLocked: boolean = false): string {
    if (isLocked) {
      return 'bg-slate-300 border-slate-500 text-slate-700 shadow-[0_0_15px_#94a3b8] grayscale brightness-75';
    }
    switch (color) {
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-[0_0_15px_#fef08a]';
      case 'blue':
        return 'bg-blue-100 border-blue-300 text-blue-800 shadow-[0_0_15px_#bfdbfe]';
      case 'red':
        return 'bg-red-100 border-red-300 text-red-800 shadow-[0_0_15px_#fecaca]';
      case 'purple':
        return 'bg-purple-100 border-purple-300 text-purple-800 shadow-[0_0_15px_#e9d5ff]';
      case 'green':
        return 'bg-green-100 border-green-300 text-green-800 shadow-[0_0_15px_#bbf7d0]';
      case 'pink':
      default:
        return 'bg-pink-100 border-pink-300 text-pink-800 shadow-[0_0_15px_#fbcfe8]';
    }
  }

  openViewModal(tanzaku: SafeZoneResponse) {
    if (this.isPlacementMode()) return;
    this.selectedTanzaku.set(tanzaku);
    this.viewModalIsOpen.set(true);
  }

  closeViewModal() {
    this.viewModalIsOpen.set(false);
    this.selectedTanzaku.set(null);
  }

  ngOnInit() {
    this.safeZoneService.getMessages().subscribe({
      next: (res) => {
        this.safeZoneMessages.set(res);
      },
      error: (err: ResourceErrorResponse) => {
        alert("Error try getting message")
      },
    });
  }
}
