import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { UserInfo } from '../models/profile';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchingValidatior } from '../utils/validator/password.validator';
import { toBirthdayString } from '../utils';
import Swal from 'sweetalert2';
import { FormatDateService } from '../services/format-date.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  defaulProfile: string =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80';
  user!: UserInfo;
  selectedTab: string = 'profile';
  profileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  formatdateService!: FormatDateService;

  constructor(
    private formBuilder: FormBuilder,
    private showToast: ToastService,
    private userService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm(); // Initialize the forms with default or empty values
    this.loadProfile(); // Load user data and update the form
  }

  initForm() {
    // Initialize the forms with default values
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', [Validators.required]],
    });

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchingValidatior }
    );
  }

  get firstName() {
    return this.profileForm.get('firstName') as FormControl;
  }

  get lastName() {
    return this.profileForm.get('lastName') as FormControl;
  }

  get email() {
    return this.profileForm.get('email') as FormControl;
  }

  get dateOfBirth() {
    return this.profileForm.get('dateOfBirth') as FormControl;
  }

  get address() {
    return this.profileForm.get('address') as FormControl;
  }

  loadProfile() {
    // Fetch the user profile and update the form with the received data
    this.userService.profile().subscribe({
      next: (response) => {
        this.user = response;
        this.updateProfileForm(); // Update the form with user data
      },
      error: (response) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword') as FormControl;
  }

  get password() {
    return this.changePasswordForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword') as FormControl;
  }

  updateProfileForm() {
    // Use `patchValue` to update the form with the loaded user data
    this.profileForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      dateOfBirth: toBirthdayString(this.user.DateOfBirth),
      address: this.user.Address,
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  profileUpdate(): void {
    // Validate the form before submitting
    if (this.profileForm.invalid) {
      this.showToast.showWarningMessage('Warning', 'Please fill in all fields');
      return;
    }

    // Prepare the request data
    const requestData = {
      FirstName: this.firstName.value,
      LastName: this.lastName.value,
      Email: this.email.value,
      DateOfBirth: this.dateOfBirth.value,
      Address: this.address.value,
    };

    if (
      this.user.FirstName === requestData.FirstName &&
      this.user.LastName === requestData.LastName &&
      this.user.Email === requestData.Email &&
      toBirthdayString(this.user.DateOfBirth) === toBirthdayString(requestData.DateOfBirth) &&
      this.user.Address === requestData.Address
    ) {
      this.showToast.showWarningMessage('Warning', 'Nothing to change.');
      return;
    }

    //popup confirm before updating the form
    const text = `First Name: ${this.user.FirstName} \n Last Name: ${this.user.LastName} \n Email: ${this.user.Email} \n Date of Birth: ${toBirthdayString(this.user.DateOfBirth)} \n Address: ${this.user.Address}`;
    Swal.fire({
      title: 'Are you sure to update profile?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateProfile(requestData).subscribe({
          next: () => {
            this.showToast.showSuccessMessage('Success', 'Profile updated');
            this.loadProfile(); // Reload the user data after successful update
          },
          error: (error) => {
            this.showToast.showWarningMessage(
              'Warning',
              error.error?.Message || 'Profile update failed. Please try again'
            );
          },
        });
      }
    });

  }

  changePasswordSubmition(): void {
    // Validate the form before submitting
    if (this.changePasswordForm.invalid) {
      this.showToast.showWarningMessage('Warning', 'Please fill in all fields');
      return;
    }

    // Prepare the request data
    const requestData = {
      CurrentPassword: this.oldPassword.value,
      NewPassword: this.password.value,
    };

    // Send the request to change the user password
    this.userService.changePassword(requestData).subscribe({
      next: () => {
        this.showToast.showSuccessMessage('Success', 'Password updated');
        this.changePasswordForm.reset(); // Reset the form after successful update
      },
      error: (error) => {
        this.showToast.showWarningMessage(
          'Warning',
          error.error?.Message || 'Change password failed. Please try again'
        );
      },
    });
  }
}
