import { Component } from '@angular/core';
import { AppHeaderComponent } from './header/app-header.component';
import { AppIntroFormComponent } from './intro-form/app-intro-form.component';
import { AppStatsComponent } from './stats/app-stats.component';
import { AppFeaturesComponent } from './features/app-features.component';
import { AppServicesComponent } from './services/app-services.component';
import { AppTestimonialsComponent } from './testimonials/app-testimonials.component';
import { AppParallaxComponent } from './parallax/app-parallax.component';
import { AppContactInfoComponent } from './contact-info/app-contact-info.component';
import { AppFooterComponent } from './footer/app-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeaderComponent, AppIntroFormComponent, AppStatsComponent, AppFeaturesComponent, AppServicesComponent, AppTestimonialsComponent, AppParallaxComponent, AppContactInfoComponent, AppFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Vaccine Chain';
}
