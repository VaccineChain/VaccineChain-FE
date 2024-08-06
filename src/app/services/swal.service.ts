import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  confirmDelete(callback: () => void) {
    this.confirmDialog(callback, 'Are you sure you want to delete this item?');
  }

  confirmArchive(callback: () => void) {
    this.confirmDialog(callback, 'Are you sure you want to archive this item?');
  }

  confirmDialog(callback: () => void, message?: string) {
    if (!message) {
      message = 'Are you sure you want to delete this item?';
    }
    return Swal.fire({
      title: message,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#f44336',
      denyButtonText: 'No',
      denyButtonColor: 'gray',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  async confirmToHandle(
    title: string,
    icon: SweetAlertIcon,
    callback: () => void
  ) {
    const result = await Swal.fire({
      title: title,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      denyButtonColor: 'gray',
      confirmButtonColor: '#dc2626',
      icon: icon,
    });
    if (result.isConfirmed) {
      callback();
    }
    return false;
  }

  async showMessageToHandle(
    title: string,
    message: string,
    icon: SweetAlertIcon,
    callback: () => void
  ) {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: icon,
    });
    if (result.isConfirmed || result.isDismissed) {
      callback();
      return true;
    }
    return false;
  }

  showMessage(title: string, message: string, icon: SweetAlertIcon) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
    });
  }
}
