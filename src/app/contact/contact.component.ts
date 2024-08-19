import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  center: google.maps.LatLngLiteral = { lat: 10.0289431, lng: 105.7774714 };
  zoom = 19.65;
}
