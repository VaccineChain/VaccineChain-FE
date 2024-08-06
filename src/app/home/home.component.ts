import { Component } from '@angular/core';
import { AppIntroFormComponent } from '../intro-form/app-intro-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppIntroFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
