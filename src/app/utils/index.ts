import moment from 'moment';

export function handleToastErrors(showToast: any, error: any): void {
  switch (error.status) {
    case 403:
      showToast.showWarningMessage('Warning', error.error.Message);
      // this.router.navigate(['/verify']);
      break;
    case 401:
      showToast.showWarningMessage('Warning', error.error.Message);
      break;
    case 400:
      showToast.showWarningMessage('Warning', error.error.Message);
      break;
    case 404:
      showToast.showWarningMessage('Warning', error.error.Message);
      break;
    default:
      showToast.showErrorMessage('Error', 'Login failed. Please try again');
  }
}

export function toBirthdayString(dateTime: Date) {
  return moment(dateTime).format('YYYY-MM-DD');
}
