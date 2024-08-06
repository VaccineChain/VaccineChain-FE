import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  selectedTab: string = 'profile';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
