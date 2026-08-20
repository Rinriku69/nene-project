import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { LocationResource, MapPosition, PositionUpdate, ResourceErrorResponse } from '../../../models/Resource';
import { StateService } from '../../../services/state.service';
import { Icons } from '../../../components/icons/icons';

const TIME_OUT = 10 * 1_000;
const MAX_AGE = 0;
const GET_POSITION_TIME = 5 * 1_000;

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
  private readonly myMarker = signal<L.Marker | null>(null);
  protected readonly isSharing = signal<boolean>(true);
  private readonly myPosition = signal<PositionUpdate | null>(null);
  private readonly myPositionState = computed<PositionUpdate | null>(() => this.myPosition());
  private getUserId?: number;

  private readonly myPinIcon = L.divIcon({
    className:'bg-blue-500 animate-pulse',
    html:'<div></div>',
    iconSize:[16,16],
    iconAnchor:[8,8]
  })
  private readonly friendPinIcon = L.divIcon({
    className:'bg-primary animate-pulse',
    html:'<div></div>',
    iconSize:[16,16],
    iconAnchor:[8,8]
  })

  protected readonly textStatus = signal<string | null>(null);

  constructor() {
    afterRenderEffect(() => {
      /* if (this.mapContainer()) {
        const lat = this.myLocation()?.lat ?? 51.505;
        const long = this.myLocation()?.long ?? -0.09;
        
      } */
      const currentPosition = this.myPositionState();
      const leafletMap = this.map();
      if (currentPosition && leafletMap) {
        const lat = currentPosition.lat;
        const long = currentPosition.long;
        const existingMarker = this.myMarker();

        if (!existingMarker) {
          leafletMap.setView([lat, long], leafletMap.getZoom(), { animate: true });
          this.myMarker.set(L.marker([lat, long],{icon: this.myPinIcon}).addTo(leafletMap));
        } else {
          existingMarker.setLatLng([lat, long]);
        }
      }
      /*  console.log('after render run')
     console.log(this.myPositionState()) */
    });

    afterNextRender(() => {
      if (!this.map()) {
        const leafletMap = L.map(this.mapContainer().nativeElement).setView([51.505, -0.09], 13);
        this.map.set(leafletMap);
        this.loadTileLayer(leafletMap);
      }
      this.updateUserMapPosition();
    });

    this.destroyRef.onDestroy(() => {
      this.map()?.remove();
      this.map.set(null);
      clearTimeout(this.getUserId);
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

  updatePosition(position: PositionUpdate): void {
    this.locationService.updatePosition(position).subscribe({
      error: (err: ResourceErrorResponse) => {
        this.stateService.setErrorMessage(`Error ${err.error.message}`);
      },
    });
  }

  updateUserMapPosition(): void {
    if (!this.isSharing()) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition: PositionUpdate = {
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
    // console.log('updated')
    this.getUserId = setTimeout(() => this.updateUserMapPosition(), GET_POSITION_TIME);
  }

  getFriendLocation(): void{
    this.locationService.getFriendLocation().subscribe({
      next:(res)=>{

      },
      error:(err)=>{

      }
    })
  }
}
