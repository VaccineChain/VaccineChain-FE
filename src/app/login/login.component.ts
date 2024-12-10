import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { passwordMatchingValidatior } from '../utils/validator/password.validator';
import { Roles } from '../models/user';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  registrationForm!: FormGroup;
  loginForm!: FormGroup;

  isLoginLoading = false;
  isRegisterLoading = false;

  isSignIn: boolean = true;
  sendingMessage = true;
  successMessage = true;
  failureMessage = true;
  incompleteMessage = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private showToast: ToastService,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isSignIn = true; // Set initial state to sign-in
    }, 200);

    this.initForm();
  }

  toggle() {
    this.isSignIn = !this.isSignIn; // Toggle between sign-in and sign-up
  }

  get firstName() {
    return this.registrationForm.get('firstName') as FormControl;
  }

  get lastName() {
    return this.registrationForm.get('lastName') as FormControl;
  }

  get emailRegister() {
    return this.registrationForm.get('email') as FormControl;
  }

  get passwordRegister() {
    return this.registrationForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword') as FormControl;
  }

  initForm() {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchingValidatior }
    );

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get emailLogin() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordLogin() {
    return this.loginForm.get('password') as FormControl;
  }

  registerSubmition(): void {
    if (this.registrationForm.invalid) {
      this.showToast.showWarningMessage('Warning', 'Please fill in all fields');
      return;
    }

    console.log(this.registrationForm.value);

    const requestData = {
      Email: this.registrationForm.value.email,
      Password: this.registrationForm.value.password,
      FirstName: this.registrationForm.value.firstName,
      LastName: this.registrationForm.value.lastName,
    };

    this.isRegisterLoading = true;
    this.authService.register(requestData).subscribe({
      next: () => {
        this.isRegisterLoading = false;
        this.swalService.showMessage(
          'Success',
          'Register successfully',
          'success'
        );
        // this.router.navigate(['/login']);
        this.toggle();
      },
      error: (error) => {
        this.isRegisterLoading = false;
        this.showToast.showErrorMessage(
          'Error',
          'Register failed. Please try again'
        );
      },
    });
  }

  loginSubmition(): void {
    if (this.loginForm.invalid) {
      this.showToast.showWarningMessage('Warning', 'Please fill in all fields');
      return;
    }

    const loginData = {
      Email: this.loginForm.value.email,
      Password: this.loginForm.value.password,
    };

    this.isLoginLoading = true;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoginLoading = false;
        this.authService.saveUser(response);

        if (response.User.Role.Name === Roles.ADMIN) {
          return this.router.navigate(['/admin/dashboard']);
        }

        return this.router.navigate(['/']);
      },
      error: (response) => {
        this.isLoginLoading = false;

        switch (response.status) {
          case 403:
            this.showToast.showWarningMessage(
              'Warning',
              response.error.Message
            );
            // this.router.navigate(['/verify']);
            break;
          case 401:
            this.showToast.showWarningMessage(
              'Warning',
              response.error.Message
            );
            break;
          default:
            this.showToast.showErrorMessage(
              'Error',
              'Login failed. Please try again'
            );
        }
      },
    });
  }

  resetMessages() {
    this.sendingMessage = false;
    this.successMessage = false;
    this.failureMessage = false;
    this.incompleteMessage = false;
  }
}




