import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intro-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app-intro-form.component.html',
  styleUrl: './app-intro-form.component.scss'
})
export class AppIntroFormComponent {
  sendingMessage = true;
  successMessage = true;
  failureMessage = true;
  incompleteMessage = true;

  model = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: ''
  };

  onSubmit() {
    this.resetMessages();
    if (this.model.firstName && this.model.lastName && this.model.email && this.model.phone) {
      this.sendingMessage = true;
      setTimeout(() => {
        this.sendingMessage = false;
        this.successMessage = true;
      }, 2000);
    } else {
      this.incompleteMessage = true;
    }
  }

  resetMessages() {
    this.sendingMessage = false;
    this.successMessage = false;
    this.failureMessage = false;
    this.incompleteMessage = false;
  }
}
