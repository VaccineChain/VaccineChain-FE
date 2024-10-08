export function handleToastErrors(showToast: any, error: any): void {
  switch (error.status) {
    case 403:
      showToast.showWarningMessage(
        'Warning',
        error.error
      );
      // this.router.navigate(['/verify']);
      break;
    case 401:
      showToast.showWarningMessage(
        'Warning',
        error.error
      );
      break;
    case 400:
      showToast.showWarningMessage(
        'Warning',
        error.error
      );
      break;
    case 404:
      showToast.showWarningMessage(
        'Warning',
        error.error
      );
      break;
    default:
      showToast.showErrorMessage(
        'Error',
        'Login failed. Please try again'
      );
  }
}
