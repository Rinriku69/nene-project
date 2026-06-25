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
  RouterLink,
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
import { PetService } from '../../../services/pet.service';
import { PetComponent } from '../../../components/pet-component/pet-component';
import { getPetIdLocalStorage, getRandomInt, setPetIdLocalStorage } from '../../../helpers';
import { PetAnimation } from '../../../models/Resource';

const KEY_PREFIX = 'nene-project';
const PET_ID_KEY = 'petId';

@Component({
  selector: 'app-main-layout',
  imports: [DecimalPipe, RouterOutlet, RouterLinkWithHref, Icons, RouterLinkActive, PetComponent],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  private readonly petService = inject(PetService);

  protected readonly currentUser = computed(() => this.authService.currentUserState());
  protected readonly currentUserPet = computed(() => this.petService.currentUserPet());

  protected readonly currentUserPetAnimation = linkedSignal<string>(() => 'idle1');
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

  async getPetId() {
    const petId = await getPetIdLocalStorage(`${KEY_PREFIX}-${PET_ID_KEY}`);
    this.petService.petId.set(petId);
    // console.log(petId)
  }

  constructor() {
    afterNextRender(() => {
      this.updateActiveCurrencyPosition();

      window.addEventListener('resize', () => this.updateActiveCurrencyPosition());
    });

  }

  ngOnInit() {
    this.getPetId();
    const randomAnimationTime = signal<number>(getRandomInt(13, 20));
    const idleAnimations = computed<string[]>(() => {
      const userPets = this.currentUserPet();
      if (userPets.hasValue()) {
        return userPets.value().pet_animations.filter((v) => v.is_idle).map(v=>v.name);
      }
      return ['idle1'];
    });
    const randomAnimationIndex = linkedSignal<number>(()=>getRandomInt(0, idleAnimations.length-1));
   

    setInterval(() => {
      randomAnimationIndex.set(getRandomInt(0, idleAnimations().length));
      const animation = idleAnimations().find((_,i)=> i=== randomAnimationIndex());
      this.currentUserPetAnimation.set(animation!);
      randomAnimationTime.set(getRandomInt(13, 20));
    },randomAnimationTime() * 1_000);
  }
}
