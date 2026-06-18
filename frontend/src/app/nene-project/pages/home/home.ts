import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Icons } from '../../components/icons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [Icons],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  boopClick() {
    if (this.authService.currentUserState()) {
      this.router.navigate(['/app/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
