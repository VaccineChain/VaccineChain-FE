import { VaccineService } from './../services/api/vaccine.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { handleToastErrors } from '../utils';
import { LogService } from '../services/api/log.service';

@Component({
  selector: 'app-intro-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './app-intro-form.component.html',
  styleUrl: './app-intro-form.component.scss'
})
export class AppIntroFormComponent implements OnInit {
  searchForm!: FormGroup;

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

  constructor(
    private vaccineService : VaccineService,
    private logService: LogService,
    private showToast: ToastService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.searchForm = new FormGroup({
      vaccineId: new FormControl('', Validators.required)
    });
  }
  get vaccineId() {
    return this.searchForm.get('vaccineId') as FormControl;
  }

  submit() : void {

    console.log(this.searchForm.value);
    this.vaccineService.getVaccineById(this.searchForm.value).subscribe({
      next: (response) => {
        this.showToast.showSuccessMessage(
          'Success',
          'Create connection successfully'
        );
        console.log(response);
        // CLEAR FORM
        this.searchForm.reset();
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
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
