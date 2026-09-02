import {
  afterNextRender,
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../../../services/location.service';
import {
  UserLocationResource,
  Position,
  UserLocation,
  ResourceErrorResponse,
} from '../../../models/Resource';
import { StateService } from '../../../services/state.service';
import { AuthService } from '../../../services/auth.service';

const TIME_OUT = 10 * 1_000;
const MAX_AGE = 0;
const GET_POSITION_TIME = 5 * 1_000;
const DELAY_AFTER_TOGGLE = 1 * 1_000;
const TICK_TIME = 30 * 1_000;
const PIN_SIZE = 32;

interface PinAppearance {
  imageUrl: string | null;
  username: string;
  isSelf: boolean;
  isOnline: boolean;
}

interface FriendMarker {
  marker: L.Marker;
  iconKey: string;
}

@Component({
  selector: 'app-location',
  imports: [],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class Location {
  private readonly locationService = inject(LocationService);
  private readonly stateService = inject(StateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  private readonly currentUser = this.authService.currentUserState();
  private readonly map = signal<L.Map | null>(null);
  private myMarker: L.Marker | null = null;
  private readonly friendMarkers = new Map<number, FriendMarker>();
  protected readonly isSharing = signal<boolean>(true);
  protected readonly myPosition = signal<UserLocation | null>(null);
  protected readonly friendPositions = signal<UserLocationResource[] | null>(null);
  private getUserId?: number;
  private getFriendId?: number;

  private readonly myPinIcon = this.buildPinIcon({
    imageUrl: this.currentUser?.image_url ?? null,
    username: this.currentUser?.username ?? '?',
    isSelf: true,
    isOnline: true,
  });

  protected readonly textStatus = signal<string | null>(null);
  protected readonly highAccuracy = signal<boolean>(true);
  protected readonly myLastUpdate = signal<Date | null>(null);
  private readonly now = signal<number>(Date.now());
  private tickId?: number;

  constructor() {
    afterRenderEffect(() => {
      const currentPosition = this.myPosition();
      const leafletMap = this.map();
      if (currentPosition && leafletMap) {
        this.syncMyMarker(leafletMap, currentPosition, this.myPinIcon);
      }
    });

    afterRenderEffect(() => {
      const leafletMap = this.map();
      const friendPositions = this.friendPositions();
      if (friendPositions && leafletMap) {
        this.syncFriendMarker(leafletMap, friendPositions);
      }
    });

    afterNextRender(() => {
      if (!this.map()) {
        const leafletMap = L.map(this.mapContainer().nativeElement).setView([51.505, -0.09], 13);
        this.map.set(leafletMap);
        this.loadTileLayer(leafletMap);
      }
      this.restoreMyLocation();
      this.runFriendLocation();
      this.tickId = setInterval(() => this.now.set(Date.now()), TICK_TIME);
    });

    this.destroyRef.onDestroy(() => {
      this.map()?.remove();
      this.map.set(null);
      this.myMarker = null;
      this.friendMarkers.clear();
      clearTimeout(this.getUserId);
      clearTimeout(this.getFriendId);
      clearInterval(this.tickId);
    });
  }

  loadTileLayer(map: L.Map): void {
    const openStreetMapTiles: L.TileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      },
    );
    openStreetMapTiles.addTo(map);
  }

  toggleSharing(): void {
    this.isSharing.set(!this.isSharing());
    clearTimeout(this.getUserId);
    if (this.isSharing()) {
      this.getUserId = setTimeout(() => this.runMyPosition(), DELAY_AFTER_TOGGLE);
    }
  }

  toggleHighAccuracy(): void {
    this.highAccuracy.set(!this.highAccuracy());
  }

  protected setTextStatus(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.textStatus.set(value || null);
  }

  syncMyMarker(map: L.Map, position: Position, icon: L.DivIcon): void {
    if (!this.myMarker) {
      this.setMapView(position);
      this.myMarker = L.marker([position.lat, position.long], { icon })
        .addTo(map)
        .bindTooltip(this.buildPinLabel(this.currentUser?.username ?? 'Me', this.textStatus()), {
          direction: 'top',
          permanent: true,
        });
    } else {
      this.myMarker.setLatLng([position.lat, position.long]);
      this.myMarker.setTooltipContent(
        this.buildPinLabel(this.currentUser?.username ?? 'Me', this.textStatus()),
      );
    }
  }

  syncFriendMarker(map: L.Map, friendPositions: UserLocationResource[]): void {
    // const seen = new Set<number>();

    friendPositions.forEach((friendPosition) => {
      // seen.add(friendPosition.user_id);

      const pin: PinAppearance = {
        imageUrl: friendPosition.image_url,
        username: friendPosition.username,
        isSelf: false,
        isOnline: friendPosition.is_online,
      };
      const iconKey = this.pinIconKey(pin);
      const existing = this.friendMarkers.get(friendPosition.user_id);

      if (!existing) {
        const marker = L.marker([friendPosition.lat, friendPosition.long], {
          icon: this.buildPinIcon(pin),
        })
          .addTo(map)
          .bindTooltip(this.buildPinLabel(friendPosition.username, friendPosition.text_status), {
            direction: 'top',
            permanent: true,
          });

        this.friendMarkers.set(friendPosition.user_id, { marker, iconKey });
        return;
      }

      existing.marker.setLatLng([friendPosition.lat, friendPosition.long]);
      existing.marker.setTooltipContent(
        this.buildPinLabel(friendPosition.username, friendPosition.text_status),
      );

      if (existing.iconKey !== iconKey) {
        existing.marker.setIcon(this.buildPinIcon(pin));
        existing.iconKey = iconKey;
      }
    });
  }

  setMapView(position: Position): void {
    const leafletMap = this.map();
    if (!leafletMap) return;
    leafletMap.setView([position.lat, position.long], leafletMap.getZoom(), { animate: true });
  }

  private pinIconKey(pin: PinAppearance): string {
    return `${pin.imageUrl ?? ''}|${pin.isOnline}`;
  }

  private buildPinIcon(pin: PinAppearance): L.DivIcon {
    const wrapper = document.createElement('div');
    wrapper.className = [
      'w-8 h-8 rounded-none border-2 overflow-hidden bg-brand-white',
      'flex items-center justify-center font-pixel font-black text-sm',
      pin.isSelf
        ? 'border-sky-500 text-sky-700 shadow-[2px_2px_0_#0369a1]'
        : 'border-primary text-primary shadow-[2px_2px_0_#70024f]',
      pin.isOnline ? 'animate-pulse' : 'grayscale opacity-50',
    ].join(' ');

    if (pin.imageUrl) {
      const avatar = document.createElement('img');
      avatar.className = 'w-full h-full object-cover';
      avatar.alt = '';
      avatar.src = pin.imageUrl;
      avatar.onerror = () => {
        avatar.remove();
        wrapper.textContent = pin.username.charAt(0).toUpperCase();
      };
      wrapper.appendChild(avatar);
    } else {
      wrapper.textContent = pin.username.charAt(0).toUpperCase();
    }

    return L.divIcon({
      html: wrapper,
      className: '',
      iconSize: [PIN_SIZE, PIN_SIZE],
      iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
      tooltipAnchor: [0, -PIN_SIZE / 2],
    });
  }

  private buildPinLabel(username: string, textStatus: string | null): HTMLElement {
    const label = document.createElement('span');
    label.className = 'font-pixel text-xs';
    label.textContent = textStatus ? `${username} · ${textStatus}` : username;
    return label;
  }

  timeAgo(value: Date | string | null): string {
    if (!value) return 'no update yet';

    const minutes = Math.floor((this.now() - new Date(value).getTime()) / 60_000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m ago`;

    return `${Math.floor(hours / 24)}d ${hours % 24}h ago`;
  }

  getFriendLocation(): void {
    this.locationService.getFriendLocation().subscribe({
      next: (res) => {
        this.friendPositions.set(res);
      },
      error: (_) => {
        this.stateService.setErrorMessage(`Error Unable to get friends location.`);
      },
    });
  }

  private updateMyPosition(position: UserLocation): void {
    this.locationService.updatePosition(position).subscribe({
      error: (err: ResourceErrorResponse) => {
        this.stateService.setErrorMessage(`Error ${err.error.message}`);
      },
    });
  }

  private getAndUpdateMyPosition(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition: UserLocation = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          text_status: this.textStatus(),
        };
        // console.log(position)
        this.myPosition.set(currentPosition);
        this.myLastUpdate.set(new Date());
        this.updateMyPosition(currentPosition);
      },
      (error) => {
        // console.error(`Error ${error.message}`)
        this.stateService.setErrorMessage(`Error ${error.message}`);
      },
      {
        enableHighAccuracy: this.highAccuracy(),
        timeout: TIME_OUT,
        maximumAge: MAX_AGE,
      },
    );
  }

  runMyPosition(): void {
    if (!this.isSharing()) return;
    this.getAndUpdateMyPosition();
    this.getUserId = setTimeout(() => this.runMyPosition(), GET_POSITION_TIME);
  }

  runFriendLocation(): void {
    this.getFriendLocation();
    this.getFriendId = setTimeout(() => this.runFriendLocation(), GET_POSITION_TIME);
  }

  restoreMyLocation(): void {
    this.locationService.getMyLocation().subscribe({
      next: (res) => {
        if (res) {
          this.textStatus.set(res.text_status);
          this.myLastUpdate.set(new Date(res.updated));
        }
        this.runMyPosition();
      },
      error: (_) => {
        this.stateService.setErrorMessage(`Error Unable to restore your last location.`);
        this.runMyPosition();
      },
    });
  }
}
