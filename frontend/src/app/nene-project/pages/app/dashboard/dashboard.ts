import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  ɵAcxViewEncapsulation,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CurrencyService } from '../../../services/currency.service';
import { ResourceErrorResponse } from '../../../models/Resource';
import { Icons } from '../../../components/icons/icons';

@Component({
  selector: 'app-dashboard',
  imports: [Icons],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly currencyService = inject(CurrencyService);

  currentUser = computed(() => this.authService.currentUserState());

  canClaimDaily = linkedSignal(() => {
    const lastClaimedStr = this.currentUser()?.last_login_at;
    if (!lastClaimedStr) {
      return true;
    }

    const lastClaimedDate = new Date(lastClaimedStr).toLocaleDateString('en-US');
    const todayDate = new Date().toLocaleDateString('en-US');

    return lastClaimedDate !== todayDate;
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
        alert('Error occurred');
        this.authService.getUser().subscribe();
        console.log(err.error.message);
      },
    });
  }
}
