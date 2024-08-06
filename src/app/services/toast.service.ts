import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private toastr: ToastrService,
  ) {
    this.toastr.toastrConfig.preventDuplicates = true;
  }

  showError() {
    this.toastr.findDuplicate(
      'Error',
      'Something went wrong. Please try again later',
      true,
      false
    );
    this.toastr.error('Something went wrong. Please try again later', 'Error', {
      timeOut: 2000,
    });
  }

  showSuccessMessage(title: string, message: string) {
    this.toastr.findDuplicate(title, message, true, false);
    this.toastr.success(message, title, {
      timeOut: 2000,
    });
  }

  showErrorMessage(title: string, message: string) {
    this.toastr.findDuplicate(title, message, true, false);
    this.toastr.error(message, title, {
      timeOut: 2000,
    });
  }

  showWarningMessage(title: string, message: string) {
    this.toastr.findDuplicate(title, message, true, false);
    this.toastr.warning(message, title, {
      timeOut: 2000,
    });
  }

  showInfoMessage(title: string, message: string) {
    this.toastr.findDuplicate(title, message, true, false);
    this.toastr.info(message, title, {
      timeOut: 2000,
    });
  }
}
