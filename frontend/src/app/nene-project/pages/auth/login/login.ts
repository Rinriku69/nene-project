import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LoginModel } from '../../../models/AuthModel';
import { AuthService } from '../../../services/auth.service';
import { switchMap, tap } from 'rxjs';
import { ResourceErrorResponse } from '../../../models/Resource';
import { LoadingComponent } from '../../../components/loading-component/loading-component';
import { LoadingService } from '../../../services/loading.service';
import { Icons } from "../../../components/icons/icons";
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormField, LoadingComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly petService = inject(PetService);

  protected readonly isLoading = computed(() => this.loadingService.isLoading());
  private readonly loginModel: WritableSignal<LoginModel> = signal({
    username: '',
    password: '',
  });
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loginForm = form(this.loginModel, (path) => {
    required(path.username, { message: 'Hey your Username!!' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
  });

   submit() {
    return this.authService
      .getCSRFToken()
      .pipe(
        switchMap(() => this.authService.login(this.loginForm().value())),
        switchMap(() => this.authService.getUser().pipe(
          tap(()=> this.petService.loadUserPet.set(true))
        )),
        switchMap(() => this.authService.getNotification()),
      )
      .subscribe({
        next: (_) => {
          this.router.navigate(['/app/dashboard']);
        },
        error: (error: ResourceErrorResponse) => {
          if (error.status === 422) {
            this.errorMessage.set(error.error.message);
          } else if (error.status === 401) {
            this.errorMessage.set('Username or Password is incorrect!');
          }
        },
      });
  }
}
