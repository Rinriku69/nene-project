import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-verify-email-banner',
  imports: [],
  templateUrl: './verify-email-banner.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './verify-email-banner.css',
})
export class VerifyEmailBanner {
  private readonly authService = inject(AuthService);
  private readonly stateService = inject(StateService);
  readonly dismissible = input<boolean>(true);
  readonly classAttribute = input<string>('');

  protected readonly dismissed = computed<boolean>(()=>this.authService.dismissed());
  protected readonly resendState = signal<'idle' | 'sending' | 'sent'>('idle');

  protected readonly show = computed(() => {
    return (!this.authService.isVerified() && !this.dismissed()) || (!this.dismissible() && !this.authService.isVerified());
  });

  private readonly banner = viewChild<ElementRef<HTMLElement>>('banner');

  constructor() {
    effect(() => {
      this.authService.attentionTick();
      const element = this.banner()?.nativeElement;
      element?.getAnimations().forEach((animation) => {
        animation.cancel();
        animation.play();
      });
    });
  }

  dismissBanner(){
    this.authService.dismissBanner();
  }

  resend() {
    if (this.resendState() !== 'idle') {
      return;
    }
    this.resendState.set('sending');
    this.authService.resendVerificationEmail().subscribe({
      next: () => {
        this.resendState.set('sent');
      },
      error: (err: HttpErrorResponse) => {
        this.resendState.set('idle');
        this.stateService.setErrorMessage(`${err.error.message} try again later`);
      },
    });
  }
}
