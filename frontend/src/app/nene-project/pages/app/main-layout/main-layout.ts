import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Icons } from '../../../components/icons/icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [DecimalPipe, RouterOutlet, RouterLinkWithHref, Icons, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly currentUser = computed(() => this.authService.currentUserState());
  protected readonly userMenuShow = signal<boolean>(false);
  protected readonly notifications = computed(() => this.authService.notifications());
  protected readonly unreadCount = linkedSignal<number>(() => {
    const noti = this.notifications();
    if (!noti) return 0;
    return noti.reduce((acc, curr) => {
      return (curr.read_at === null ? 1 : 0) + acc;
    }, 0);
  });

  protected readonly notiIsOpen = signal<boolean>(false);

  toggleNoti(): void {
    this.notiIsOpen.set(!this.notiIsOpen());
    if (this.notiIsOpen() === true && this.unreadCount() !== 0) {
      this.markNotiAsReadAll();
      this.unreadCount.set(0);
    }
  }

  toggleUserMenu(): void {
    this.userMenuShow.set(!this.userMenuShow());
  }

  markNotiAsReadAll() {
    this.authService.markNotiAsReadAll().subscribe();
  }

  logout() {
    return this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.warn('Log out error, Please try again');
      },
    });
  }
}
