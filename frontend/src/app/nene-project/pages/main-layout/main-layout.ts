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
  DestroyRef,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  RouterLink,
  Router,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Icons } from '../../components/icons/icons';
import { DecimalPipe } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { PetService } from '../../services/pet.service';
import { PetComponent } from '../../components/pet-component/pet-component';
import { getPetIdLocalStorage, getRandomInt, setPetIdLocalStorage } from '../../helpers';
import { PetAnimation, UserPet } from '../../models/Resource';
import { StardewService } from '../../services/stardew.service';
import { VerifyEmailBanner } from '../../components/verify-email-banner/verify-email-banner';

@Component({
  selector: 'app-main-layout',
  imports: [DecimalPipe, RouterOutlet, RouterLinkWithHref, Icons, RouterLinkActive, PetComponent, VerifyEmailBanner],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  private readonly petService = inject(PetService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stardewService = inject(StardewService);

  protected readonly currentUser = computed(() => this.authService.currentUserState());
  protected readonly currentUserPet = computed(() => {
    const currentPet = this.petService.currentUserPet();
    if (currentPet.hasValue() && currentPet.value()) {
      return currentPet.value();
    }
    clearTimeout(this.animationTimout);
    return null;
  });

  private readonly isIdleAnimation = computed<string[]>(() => {
    const currentPet = this.currentUserPet();
    if (currentPet) {
      return currentPet.pet_animations.filter((v) => v.is_idle).map((v) => v.name);
    }
    return ['idle1'];
  });
  private animationTimout?: ReturnType<typeof setTimeout>;
  protected readonly currentUserPetAnimation = signal<string>('idle1');
  private readonly isIdleRotationEnabled = signal<boolean>(true);

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


  protected readonly isProfileRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.includes('/profile')),
    ),
    { initialValue: this.router.url.includes('/profile') },
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
    this.stardewService.saves.set(undefined);
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

  getRandomAnimation(): string {
    const randomAnimationIndex = getRandomInt(0, this.isIdleAnimation().length - 1);
    return this.isIdleAnimation()[randomAnimationIndex];
  }

  randomPetAnimation(): void {
    const animationDelay = getRandomInt(10, 15);
    const petAnimation = this.getRandomAnimation();
    this.currentUserPetAnimation.set(petAnimation);
    this.animationTimout = setTimeout(() => this.randomPetAnimation(), animationDelay * 1_000);
  }

  constructor() {
    afterNextRender(() => {
      this.updateActiveCurrencyPosition();

      window.addEventListener('resize', () => this.updateActiveCurrencyPosition());
    });

    effect(() => {
      if (this.currentUserPet() && this.isIdleRotationEnabled()) {
        this.randomPetAnimation();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.animationTimout) {
        clearTimeout(this.animationTimout);
      }
    });
  }

  async ngOnInit() {
    await this.petService.getCurrentPetId();
    this.petService.loadUserPet.set(true);
  }
}
