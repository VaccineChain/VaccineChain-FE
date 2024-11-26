import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {

  constructor() { }

  toTimeString(dateTime: string) {
    return moment(dateTime).format('HH:mm:ss');
  }

  toDateString(dateTime: string) {
    return moment(dateTime).format('MMM Do, YYYY');
  }

  toBirthdayString(dateTime: string) {
    return moment(dateTime).format('YYYY-MM-DD');
  }

  toFullDateTimeString(dateTime: string): string {
    return `${this.toDateString(dateTime)} - ${this.toTimeString(dateTime)}`;
  }

  toCompactDateTimeString(dateTime: string): string {
    return moment(dateTime).format('DD, MMM HH:mm:ss');
  }
}

