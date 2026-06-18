import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {
  GachaItem,
  ResourceErrorResponse,
  PaginationResponse,
  GachaLog,
} from '../../../models/Resource';
import { GachaService } from '../../../services/gacha.service';
import { AudioService } from '../../../services/audio.service';
import { ItemResultComponent } from '../../../components/item-result-component/item-result-component';
import { ItemViewComponent } from '../../../components/item-view-component/item-view-component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-gacha',
  imports: [ItemResultComponent, ItemViewComponent, DecimalPipe],
  templateUrl: './gacha.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gacha.css',
})
export class Gacha implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly gachaService = inject(GachaService);
  private readonly audioService = inject(AudioService);
  currentUser = computed(() => this.authService.currentUserState());
  isRolling = signal<boolean>(false);
  pullResults = signal<GachaItem[] | null>(null);
  selectedItem = signal<GachaItem | null>(null);

  rollType = signal<1 | 10 | 0>(0);
  confirmModal = signal<boolean>(false);
  pullAmount = signal<number | null>(null);
  gemLeft = signal<number>(0);

  featuredItems = this.gachaService.featureBanner;

  viewItem(item: GachaItem) {
    this.selectedItem.set(item);
  }

  closeItem() {
    this.selectedItem.set(null);
  }

  closeConfirmModal() {
    this.confirmModal.set(false);
  }

  confirmPull(type: 1 | 10) {
    this.confirmModal.set(true);
    if (type === 1) {
      this.rollType.set(type);
      this.pullAmount.set(100);
      this.gemLeft.set(this.currentUser()?.currency! - this.pullAmount()!);
    } else {
      this.rollType.set(type);
      this.pullAmount.set(1000);
      this.gemLeft.set(this.currentUser()?.currency! - this.pullAmount()!);
    }
  }

  roll() {
    if (this.isRolling()) return;
    this.isRolling.set(true);
    this.closeConfirmModal();
    this.pullResults.set(null);

    this.gachaService.gachaRoll(this.rollType()).subscribe({
      next: (response) => {
        this.pullResults.set(response.results);
        this.rollType() === 1
          ? this.audioService.playSfx('singlePull.mp3')
          : this.audioService.playSfx('multiPull.mp3');
        this.authService.getUser().subscribe();
        this.isRolling.set(false);
      },
      error: (error: ResourceErrorResponse) => {
        this.isRolling.set(false);
        console.error(error);
      },
    });
  }

  closeResults() {
    this.pullResults.set(null);
    this.isRolling.set(false);
  }

  currentSlide = signal(0);
  private slideInterval: any;

  logModal = signal<boolean>(false);
  gachaLogs = signal<PaginationResponse<GachaLog> | null>(null);

  openLogModal() {
    this.logModal.set(true);
    this.fetchLogs(1);
  }

  fetchLogs(page: number) {
    this.gachaService.getGachaLogs(page).subscribe({
      next: (response) => {
        this.gachaLogs.set(response);
      },
      error: (error: ResourceErrorResponse) => {
        console.error(error);
      },
    });
  }

  changeLogPage(page: number) {
    if (page >= 1 && page <= (this.gachaLogs()?.last_page || 1)) {
      this.fetchLogs(page);
    }
  }

  closeLogModal() {
    this.logModal.set(false);
  }

  ngOnInit() {
    this.slideInterval = setInterval(() => {
      if (this.featuredItems.hasValue()) {
        this.currentSlide.update((index) => (index + 1) % this.featuredItems.value()!.length);
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
