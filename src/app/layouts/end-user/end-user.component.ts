import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../header/app-header.component';
import { AppFooterComponent } from '../../footer/app-footer.component';

@Component({
  selector: 'app-end-user',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './end-user.component.html',
  styleUrl: './end-user.component.scss'
})
export class EndUserComponent {

}
