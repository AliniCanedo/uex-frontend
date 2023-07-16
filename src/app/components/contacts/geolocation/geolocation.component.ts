import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocation',
  template: `
    <div>
      <div id="map" style="height: 500px;"></div>
    </div>
  `,
})
export class GeolocationComponent implements OnInit {
  @Input() latitude!: number;
  @Input() longitude!: number;
  map: any;
  marker: any;

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['latitude'] &&
      changes['latitude'].currentValue !== changes['latitude'].previousValue ||
      changes['longitude'] &&
      changes['longitude'].currentValue !== changes['longitude'].previousValue
    ) {
      if (this.map) {
        this.updateMarker();
      } else {
        this.initMap();
      }
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

      this.map.on('click', (event: any) => {
        this.latitude = event.latlng.lat;
        this.longitude = event.latlng.lng;
        this.updateMarker();
      });

      this.updateMarker();
    } else {
      this.getCurrentLocation();
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.initMap();
        },
        (error) => {
          console.log('Erro ao obter a localização atual:', error);
        }
      );
    } else {
      console.log('Geolocalização não suportada pelo navegador.');
    }
  }

  updateMarker() {
    if (this.marker) {
      this.marker.setLatLng([this.latitude, this.longitude]);
    } else {
      if (this.map) {
        this.marker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(this.map);
        this.marker.on('dragend', (event: any) => {
          const { lat, lng } = event.target.getLatLng();
          this.latitude = lat;
          this.longitude = lng;
        });
      }
    }
    this.map.setView([this.latitude, this.longitude], 13);
  }
}
