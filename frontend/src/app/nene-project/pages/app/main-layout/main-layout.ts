import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  QueryList,
  signal,
  viewChild,
  viewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  Router,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Icons } from '../../../components/icons/icons';
import { DecimalPipe } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-main-layout',
  imports: [DecimalPipe, RouterOutlet, RouterLinkWithHref, Icons, RouterLinkActive],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  protected readonly currentUser = computed(() => this.authService.currentUserState());
  protected readonly userMenuShow = signal<boolean>(false);
  protected readonly mobileMenuOpen = signal<boolean>(false);
  protected readonly notifications = computed(() => this.authService.notifications());
  protected readonly unreadCount = linkedSignal<number>(() => {
    const noti = this.notifications();
    if (!noti) return 0;
    return noti.reduce((acc, curr) => {
      return (curr.read_at === null ? 1 : 0) + acc;
    }, 0);
  });

  userCurrency = viewChildren<ElementRef<HTMLElement>>('userCurrency');

  protected readonly notiIsOpen = signal<boolean>(false);

  protected readonly isDarkTheme = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.includes('/safezone')),
    ),
    { initialValue: this.router.url.includes('/safezone') },
  );

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

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
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

  updateActiveCurrencyPosition() {
    const activeTarget = this.userCurrency().find((t) => t.nativeElement.checkVisibility());

    if (activeTarget) {
      this.layoutService.updateUserCurrencyElem(activeTarget);
    }
  }

  constructor() {
    afterNextRender(() => {
      this.updateActiveCurrencyPosition();

      window.addEventListener('resize', () => this.updateActiveCurrencyPosition());
    });
  }
}
