import { VaccineService } from './../services/api/vaccine.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { handleToastErrors } from '../utils';
import { LogService } from '../services/api/log.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-intro-form',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
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
    private router: Router,
    private showToast: ToastService,
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
    var vaccineId = this.searchForm.value.vaccineId;

    if(vaccineId == '') {
      this.showToast.showWarningMessage('Warning', 'Please enter a vaccine ID');
      return;
    }

    this.vaccineService.getVaccineById(vaccineId).subscribe({
      next: (response) => {
        this.searchForm.reset();
        console.log(response);
        // Chuyển hướng đến SearchResultComponent với vaccineId
        // this.router.navigate(['/result'], { queryParams: { vaccineId: vaccineId } });
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
