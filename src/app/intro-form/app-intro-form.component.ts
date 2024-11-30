import { VaccineResponse } from './../models/dto/vaccineResponse';
import { VaccineService } from './../services/api/vaccine.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { handleToastErrors } from '../utils';
import { LogService } from '../services/api/log.service';
import { Router, RouterLink } from '@angular/router';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-intro-form',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './app-intro-form.component.html',
  styleUrl: './app-intro-form.component.scss',
})
export class AppIntroFormComponent implements OnInit {
  searchForm!: FormGroup;
  sendingMessage = true;
  successMessage = true;
  failureMessage = true;
  incompleteMessage = true;

  vaccineResponse!: VaccineResponse[];

  model = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
  };

  constructor(
    private vaccineService: VaccineService,
    private router: Router,
    private showToast: ToastService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.searchForm = new FormGroup({
      vaccineId: new FormControl('', Validators.required),
    });
  }
  get vaccineId() {
    return this.searchForm.get('vaccineId') as FormControl;
  }

  submit(): void {
    var vaccineId = this.searchForm.value.vaccineId;

    if (vaccineId == '') {
      this.showToast.showWarningMessage('Warning', 'Please enter a vaccine ID');
      return;
    }

    this.vaccineService.getVaccineResponse(vaccineId).subscribe({
      next: (response: any) => {
        this.vaccineResponse = response.Data;
        console.log('Vaccine data:', this.vaccineResponse);

        // convert to date from time unix to date
        this.vaccineResponse = response.Data.map((item: any) => {
          return {
            ...item,
            created_date: new Date(Number(item.created_date) * 1000), // Chuyển timestamp UNIX thành Date
          };
        });

        // Gởi tất cả dữ liệu vaccineResponse lên /results với tên listVaccine
        this.router.navigate(['/result'], {
          state: { listVaccine: this.vaccineResponse },
        });
      },
      error: (error) => {
        console.error('Error fetching vaccine data:', error);
        if (error.status === 401) {
          // this.router.navigate(['/login']);
          this.swalService.showMessageToHandle(
            'Warning',
            'Please login to continue',
            'warning',
            () => this.router.navigate(['/login'])
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
