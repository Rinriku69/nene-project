import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResetPasswordModel } from '../../../models/AuthModel';
import { AuthService } from '../../../services/auth.service';
import { LoadingComponent } from '../../../components/loading-component/loading-component';
import { LoadingService } from '../../../services/loading.service';
import { ResourceErrorResponse } from '../../../models/Resource';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, FormField, LoadingComponent],
  templateUrl: './reset-password.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingService = inject(LoadingService);

  protected readonly isLoading = computed(() => this.loadingService.isLoading());
  protected readonly errorMessage = signal<string | null>(null);

  private readonly resetPasswordModel: WritableSignal<ResetPasswordModel> = signal({
    token: this.route.snapshot.queryParamMap.get('token') ?? '',
    email: this.route.snapshot.queryParamMap.get('email') ?? '',
    password: '',
    password_confirmation: '',
  });
  protected readonly invalidLink = computed(
    () => this.resetPasswordModel().token === '' || this.resetPasswordModel().email === '',
  );

  protected readonly resetPasswordForm = form(this.resetPasswordModel, (path) => {
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
    required(path.password_confirmation, { message: 'Please confirm your password' });
    validate(path.password_confirmation, ({ value }) => {
      if (value() !== null && value() !== this.resetPasswordForm.password().value()) {
        return { kind: 'https', message: 'Confirm password not match' };
      }
      return null;
    });
  });

  protected readonly formSubmitDisable: Signal<boolean> = computed(() => {
    if (
      this.resetPasswordForm().invalid() ||
      this.resetPasswordForm.password_confirmation().invalid()
    ) {
      return true;
    }
    return false;
  });

  protected submit() {
    if (this.formSubmitDisable()) {
      return;
    }

    this.authService
      .getCSRFToken()
      .pipe(switchMap(() => this.authService.resetPassword(this.resetPasswordForm().value())))
      .subscribe({
        next: (_) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error: ResourceErrorResponse) => {
          this.errorMessage.set(error.error.message ?? 'Something went wrong, Try again later');
        },
      });
  }
}
