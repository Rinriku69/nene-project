import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { LoginModel } from '../../models/AuthModel';
import { AuthService } from '../../services/auth.service';
import { ResourceErrorResponse } from '../../models/Resource';
import { LoadingComponent } from '../../components/loading-component/loading-component';
import { LoadingService } from '../../services/loading.service';
import { Icons } from '../../components/icons/icons';

@Component({
  selector: 'app-token-login',
  imports: [FormField, LoadingComponent, Icons],
  templateUrl: './token-login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './token-login.css',
})
export class TokenLogin {
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);

 
  readonly port = input<string>();
  readonly state = input<string>();

  protected readonly isLoading = computed(() => this.loadingService.isLoading());
  private readonly loginModel: WritableSignal<LoginModel> = signal({
    username: '',
    password: '',
  });
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly accessToken = signal<string | null>(null);
  protected readonly redirecting = signal(false);
  protected readonly copied = signal(false);
  protected readonly tokenForm = form(this.loginModel, (path) => {
    required(path.username, { message: 'Hey your Username!!' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
  });

  private readonly callbackPort = computed<number | null>(() => {
    const raw = this.port();

    if (!raw || !/^\d{1,5}$/.test(raw)) return null;
    const port = Number(raw);
    return port >= 1 && port <= 65535 ? port : null;
  });

  submit() {
    return this.authService.jwtLogin(this.tokenForm().value()).subscribe({
      next: ({ access_token }) => {
        const port = this.callbackPort();
        const state = this.state();
        if (port !== null && state) {
          this.redirecting.set(true);
          const { username } = this.tokenForm().value();
          window.location.href =
            `http://127.0.0.1:${port}/callback` +
            `?token=${encodeURIComponent(access_token)}` +
            `&username=${encodeURIComponent(username)}` +
            `&state=${encodeURIComponent(state)}`;
        } else {
          this.accessToken.set(access_token);
        }
      },
      error: (error: ResourceErrorResponse) => {
        if (error.status === 422) {
          this.errorMessage.set(error.error.message);
        } else if (error.status === 401) {
          this.errorMessage.set('Username or Password is incorrect!');
        } else if (error.status === 429) {
          this.errorMessage.set('Too many tries! Wait a minute and try again~');
        }
      },
    });
  }

  copyToken() {
    const token = this.accessToken();
    if (!token) return;
    navigator.clipboard.writeText(token).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
