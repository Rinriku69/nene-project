import { Component, effect, ElementRef, viewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-location',
  imports: [],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class Location {
  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');
  private map: L.Map | null = null;
  constructor() {
    effect(() => {
      if (this.mapContainer()) {
        this.map = L.map(this.mapContainer()?.nativeElement).setView([51.505, -0.09], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      }
    });
  }
}
