import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ForgotPasswordModel } from '../../../models/AuthModel';
import { AuthService } from '../../../services/auth.service';
import { LoadingComponent } from '../../../components/loading-component/loading-component';
import { LoadingService } from '../../../services/loading.service';
import { ResourceErrorResponse } from '../../../models/Resource';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormField, LoadingComponent],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);

  protected readonly isLoading = computed(() => this.loadingService.isLoading());
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly forgotPasswordModel: WritableSignal<ForgotPasswordModel> = signal({
    email: '',
  });
  protected readonly forgotPasswordForm = form(this.forgotPasswordModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter valid email' });
  });

  protected submit() {
    if (this.forgotPasswordForm().invalid()) {
      return;
    }

    this.authService
      .getCSRFToken()
      .pipe(switchMap(() => this.authService.forgotPassword(this.forgotPasswordForm().value())))
      .subscribe({
        next: (response) => {
          this.errorMessage.set(null);
          this.successMessage.set(response.message);
        },
        error: (error: ResourceErrorResponse) => {
          this.successMessage.set(null);
          this.errorMessage.set(error.error.message ?? 'Something went wrong, Try again later');
        },
      });
  }
}
