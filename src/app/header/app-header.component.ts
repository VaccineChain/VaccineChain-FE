import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent implements OnInit {
  isLogin = false;

  constructor(
    private authService: AuthService,
    private swalService: SwalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLogin = this.authService.isLoggedIn();
  }

  handleLogout() {
    this.swalService.confirmToHandle(
      'Are you sure you want to logout?',
      'warning',
      () => {
        this.authService.logout();
        this.isLogin = false;
        this.router.navigate(['/']);
      }
    );
  }
}
