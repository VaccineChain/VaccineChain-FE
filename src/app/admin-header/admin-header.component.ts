import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink, RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent {
  constructor(
    private authService: AuthService,
    private swalService: SwalService,
    private router: Router
  ) {}

  handleLogout() {
    this.swalService.confirmToHandle(
      'Are you sure you want to logout?',
      'warning',
      () => {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    );
  }
}
