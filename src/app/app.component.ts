import { Component } from '@angular/core';
import { AppHeaderComponent } from './header/app-header.component';
import { AppIntroFormComponent } from './intro-form/app-intro-form.component';
import { AppStatsComponent } from './stats/app-stats.component';
import { AppFeaturesComponent } from './features/app-features.component';
import { AppServicesComponent } from './services/app-services.component';
import { AppFooterComponent } from './footer/app-footer.component';
import { AppTestimonialsComponent } from './testimonials/app-testimonials.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeaderComponent, AppIntroFormComponent, AppStatsComponent, AppTestimonialsComponent, AppFeaturesComponent, AppServicesComponent, AppFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Vaccine Chain';
}
