import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
  WritableSignal,
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
import { Icons } from '../../../components/icons/icons';

const TIME_OUT = 10 * 1_000;
const MAX_AGE = 0;
const GET_POSITION_TIME = 5 * 1_000;
const DELAY_AFTER_TOGGLE = 1 * 1_000;

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
  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  private readonly map = signal<L.Map | null>(null);
  private myMarker: L.Marker | null = null;
  private readonly friendMarkers = new Map<number, L.Marker>();
  protected readonly isSharing = signal<boolean>(true);
  private readonly myPosition = signal<UserLocation | null>(null);
  private readonly friendPositions = signal<UserLocationResource[] | null>(null);
  private getUserId?: number;
  private getFriendId?: number;

  private readonly myPinIcon = L.divIcon({
    className: 'bg-blue-500 animate-pulse',
    html: '<div></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  protected readonly textStatus = signal<string | null>(null);

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
      this.updateUserPosition();
      this.updateFriendLocation();
    });

    this.destroyRef.onDestroy(() => {
      this.map()?.remove();
      this.map.set(null);
      clearTimeout(this.getUserId);
      clearTimeout(this.getFriendId);
    });
  }

  setMapView(map: L.Map, position: Position): void {
    map.setView([position.lat, position.long], map.getZoom(), { animate: true });
  }

  syncMyMarker(map: L.Map, position: Position, icon: L.DivIcon): void {
    if (!this.myMarker) {
      this.setMapView(map, position);
      this.myMarker = L.marker([position.lat, position.long], { icon: icon }).addTo(map);
    } else {
      this.myMarker.setLatLng([position.lat, position.long]);
    }
  }

  syncFriendMarker(map: L.Map, friendPositions: UserLocationResource[]): void {
    friendPositions.forEach((userPosition) => {
      const marker = this.friendMarkers.get(userPosition.user_id);
      const icon: L.DivIcon = userPosition.image_url
        ? L.divIcon({
            html: `<img src=${userPosition.image_url} class="w-10 h-10" />`,
            
          })
        : L.divIcon({
            className: 'bg-pink-500 animate-pulse',
            html: '<div></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

      if (!marker) {
        const newMarker: L.Marker = L.marker([userPosition.lat, userPosition.long], { icon }).addTo(
          map,
        );

        this.friendMarkers.set(userPosition.user_id, newMarker);
      } else {
        marker.setLatLng([userPosition.lat, userPosition.long]);
      }
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

  updatePosition(position: UserLocation): void {
    this.locationService.updatePosition(position).subscribe({
      error: (err: ResourceErrorResponse) => {
        this.stateService.setErrorMessage(`Error ${err.error.message}`);
      },
    });
  }

  updateUserPosition(): void {
    if (!this.isSharing()) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition: UserLocation = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          text_status: this.textStatus(),
        };
        // console.log(position)
        this.myPosition.set(currentPosition);
        this.updatePosition(currentPosition);
      },
      (error) => {
        // console.error(`Error ${error.message}`)
        this.stateService.setErrorMessage(`Error ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: TIME_OUT,
        maximumAge: MAX_AGE,
      },
    );
    this.getUserId = setTimeout(() => this.updateUserPosition(), GET_POSITION_TIME);
  }

  updateFriendLocation(): void {
    this.getFriendLocation();
    this.getFriendId = setTimeout(() => this.updateFriendLocation(), GET_POSITION_TIME);
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

  toggleSharing(): void {
    this.isSharing.set(!this.isSharing());
    if (this.isSharing()) {
      setTimeout(() => this.updateUserPosition(), DELAY_AFTER_TOGGLE);
    }
  }
}
