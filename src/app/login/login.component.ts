import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../models/login';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isSignIn: boolean = true;
  loginForm!: FormGroup;
  loginData!: Login;
  sendingMessage = true;
  successMessage = true;
  failureMessage = true;
  incompleteMessage = true;

  model = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private showToast: ToastService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.isSignIn = true;  // Set initial state to sign-in
    }, 200);

    this.initForm();
  }

  toggle() {
    this.isSignIn = !this.isSignIn;  // Toggle between sign-in and sign-up
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  submit() : void {
    // var email = this.loginForm.value.email;
    // var password = this.loginForm.value.password;

    var email = "admin";
    var password = "admin@123";

    if(email == '' || password == '') {
      this.showToast.showWarningMessage('Warning', 'Email and password are required');
      return;
    }

    if (email === 'admin' && password === 'admin@123') {
      this.loginData = {
        Email: email,
        Password: password,
      };
      this.authService.login(this.loginData).subscribe(() => {
        this.successMessage = true;
        this.router.navigate(['/admin']); // Điều chỉnh theo trang chính của bạn
      });
    } else {
      this.failureMessage = true;
    }
  }

  resetMessages() {
    this.sendingMessage = false;
    this.successMessage = false;
    this.failureMessage = false;
    this.incompleteMessage = false;
  }
}
