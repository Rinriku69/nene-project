import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  linkedSignal,
  viewChild,
  ɵAcxViewEncapsulation,
  ChangeDetectionStrategy,
  DestroyRef,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CurrencyService } from '../../../services/currency.service';
import { ResourceErrorResponse } from '../../../models/Resource';
import { Icons } from '../../../components/icons/icons';
import { LayoutService } from '../../../services/layout.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Icons, RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly currencyService = inject(CurrencyService);
  private readonly layoutService = inject(LayoutService);
  private readonly destroyRef = inject(DestroyRef);
  readonly currentUser = computed(() => this.authService.currentUserState());
  readonly userCurrency = computed(() => this.layoutService.userCurrencyElement());
  readonly canClaimDaily = linkedSignal(() => {
    const lastClaimedStr = this.currentUser()?.last_login_at;
    if (!lastClaimedStr) {
      return true;
    }

    const lastClaimedDate = new Date(lastClaimedStr).toLocaleDateString('en-US');
    const todayDate = new Date().toLocaleDateString('en-US');

    return lastClaimedDate !== todayDate;
  });

  protected readonly countDownTime = signal({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  claimDailyGems() {
    this.authService.currentUserState.update((v) => {
      if (v) {
        return { ...v, currency: v.currency + 450 };
      }
      return null;
    });
    this.canClaimDaily.set(false);
    this.currencyService.getDailyLogin().subscribe({
      next: (response) => {
        this.authService.getUser().subscribe();
      },
      error: (err: ResourceErrorResponse) => {
        alert('Error occurred, Try again later');
        this.authService.getUser().subscribe();
      },
    });
  }

  claimLoginAnimate(claimBtn: HTMLElement): void {
    const userCurrecny = this.userCurrency()?.nativeElement;
    if (!userCurrecny) return;

    const claimBtnRect = claimBtn.getBoundingClientRect();
    const userCurrencyRect = userCurrecny.getBoundingClientRect();

    const flyDiv = document.createElement('div');
    flyDiv.className = 'fixed z-2000 w-4 h-4 bg-blue-500 rounded-none transition-all duration-1000';
    flyDiv.style.left = `${claimBtnRect.left + claimBtnRect.width / 2}px`;
    flyDiv.style.top = `${claimBtnRect.top}px`;
    flyDiv.style.transform = 'translate(0,0) scale(3)';
    flyDiv.style.opacity = '1';

    document.body.appendChild(flyDiv);

    requestAnimationFrame(() => {
      flyDiv.style.transform = `translate(
      ${userCurrencyRect.left - claimBtnRect.left - claimBtnRect.width / 2}px,${userCurrencyRect.top - claimBtnRect.top}px) scale(1)`;
      flyDiv.style.opacity = '0.3';
    });
    this.currencyPulse();
    setTimeout(() => flyDiv.remove(), 1200);
  }

  currencyPulse() {
    const userCurrency = this.userCurrency()?.nativeElement;

    userCurrency?.classList.add('animate-pulse');
    setTimeout(() => {
      userCurrency?.classList.remove('animate-pulse');
    }, 4000);
  }

  getMonthlyTarget(date: number) {
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), date, 0, 0, 0);

    if (now > target) {
      target.setMonth(target.getMonth() + 1);
    }

    return target;
  }

  constructor() {
    
    const countDown = setInterval(() => {
      const nextAnn = this.getMonthlyTarget(11);
      const now = new Date();
      const diff = nextAnn.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      this.countDownTime.update((_) => ({ days: d, hours: h, minutes: m, seconds: s }));
    }, 1_000);

    this.destroyRef.onDestroy(() => {
      clearInterval(countDown);
    });
  }
}
