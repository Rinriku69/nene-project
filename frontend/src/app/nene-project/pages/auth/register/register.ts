import {
  Component,
  computed,
  effect,
  inject,
  Resource,
  Signal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
  linkedSignal,
} from '@angular/core';
import {
  debounce,
  email,
  form,
  FormField,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { RegisterModel } from '../../../models/AuthModel';
import { AuthService } from '../../../services/auth.service';
import { LoadingComponent } from '../../../components/loading-component/loading-component';
import { LoadingService } from '../../../services/loading.service';
import {
  ErrorObjectResponse,
  ResourceErrorResponse,
  ResourceResponse,
} from '../../../models/Resource';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormField, LoadingComponent],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  protected readonly errorMessage: WritableSignal<Required<ErrorObjectResponse>> = signal({
    errors: {
      username: [],
      email: [],
    },
    message: '',
  });
  protected readonly isLoading = computed(()=> this.loadingService.isLoading());
  protected readonly formSubmitDisable: Signal<boolean> = computed(() => {
    if (this.registerForm().invalid() || this.registerForm.password_confirmation().invalid()) {
      return true;
    }
    return false;
  });

  private readonly registerModel: WritableSignal<RegisterModel> = signal({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  });
  protected readonly registerForm = form(this.registerModel, (path) => {
    debounce(path.email, 500);
    email(path.email, { message: 'Please enter valid email' });
    required(path.email, { message: 'Email is required' });
    required(path.username, { message: 'Username is required' });
    required(path.password, { message: 'Password is required' });
    required(path.password_confirmation, { message: 'Please confirm your password' });
    validate(path.password_confirmation, ({ value }) => {
      if (value() !== null && value() !== this.registerForm.password().value()) {
        return { kind: 'https', message: 'Confirm password not match' };
      }
      return null;
    });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
  });

  protected submit() {
    if (this.registerForm().invalid()) {
      console.error('Register form invalid');
      return;
    }
    this.authService.getCSRFToken().subscribe({
      next: () => {
        this.authService.register(this.registerForm().value()).subscribe({
          next: (response) => {
            this.router.navigate(['/auth/login']);
          },
          error: (error: ResourceErrorResponse) => {
            this.errorMessage.set({
              message: error.error.message,
              errors: { username: [], email: [], ...error.error.errors },
            });
          },
        });
      },
      error: (_) => {
        console.error('Failed to get CSRF Token');
      },
    });
  }
}
