import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email-banner',
  imports: [],
  templateUrl: './verify-email-banner.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './verify-email-banner.css',
})
export class VerifyEmailBanner {
  private readonly authService = inject(AuthService);

  readonly dismissible = input<boolean>(true);
  readonly classAttribute = input<string>('');

  protected readonly dismissed = signal<boolean>(false);
  protected readonly resendState = signal<'idle' | 'sending' | 'sent'>('idle');

  protected readonly show = computed(() => {
    const user = this.authService.currentUserState();
    return user != null && user.email_verified_at == null && !this.dismissed();
  });

  resend() {
    if (this.resendState() !== 'idle') {
      return;
    }
    this.resendState.set('sending');
    this.authService.resendVerificationEmail().subscribe({
      next: () => {
        this.resendState.set('sent');
      },
      error: () => {
        this.resendState.set('idle');
      },
    });
  }
}
