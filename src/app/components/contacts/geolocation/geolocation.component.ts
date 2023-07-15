import { Component, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocation',
  template: `
    <div>
      <div id="map" style="height: 500px;"></div>
    </div>
  `,
})
export class GeolocationComponent {
  @Input() latitude!: number;
  @Input() longitude!: number;
  map: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['latitude'] && changes['longitude']) {
      this.initMap();
    }
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }
  
    if (this.latitude && this.longitude) {
      this.map = L.map('map').setView([this.latitude, this.longitude], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
      }).addTo(this.map);
  
      L.marker([this.latitude, this.longitude]).addTo(this.map);
    }
  }  
}
