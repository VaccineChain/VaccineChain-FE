import { FormatDateService } from './../services/format-date.service';
import { StatisticLogService } from './../services/api/statistic-log.service';
import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../services/api/vaccine.service';
import { ToastService } from '../services/toast.service';
import { NgFor, NgIf } from '@angular/common';
import { Log } from '../models/log';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { Vaccine } from '../models/vaccine';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VaccineDetail } from '../models/vaccineDetail';
import { handleToastErrors } from '../utils';

@Component({
  selector: 'app-manage-vaccine',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-vaccine.component.html',
  styleUrl: './manage-vaccine.component.scss'
})
export class ManageVaccineComponent implements OnInit {
  vaccines: Vaccine[] = []
  logs: Log[] = [];
  statisticLog: VaccineDetail | undefined;
  popupTitle: string = '';
  vaccineForm!: FormGroup;
  isEditMode: boolean = false;
  searchForm!: FormGroup;
  selectSearchOption: any = [
    { id: 1, name: 'Vaccine ID' },
    { id: 2, name: 'Vaccine Name' },
    { id: 3, name: 'Batch Number' },
    { id: 4, name: 'Manufacturer' },
    { id: 5, name: 'Expiration Date' }
  ];
  searchValue: string = '';
  currentSearchUrl: string | null = null;
  showClearButton = false;

  constructor(
    private vaccineService: VaccineService,
    private showToast: ToastService,
    private statisticLogService: StatisticLogService,
    private formatDateService: FormatDateService
  ) { }

  ngOnInit(): void {
    this.loadVaccines();
    this.initForm();
    this.createSearchForm();
  }

  initForm() {
    this.vaccineForm = new FormGroup({
      vaccineId: new FormControl('', Validators.required),
      vaccineName: new FormControl('', Validators.required),
      manufacturer: new FormControl('', Validators.required),
      batchNumber: new FormControl('', Validators.required),
      expirationDate: new FormControl('', Validators.required),
    });
  }

  get vaccineId() {
    return this.vaccineForm.get('vaccineId') as FormControl;
  }
  get vaccineName() {
    return this.vaccineForm.get('vaccineName') as FormControl;
  }
  get manufacturer() {
    return this.vaccineForm.get('manufacturer') as FormControl;
  }
  get batchNumber() {
    return this.vaccineForm.get('batchNumber') as FormControl;
  }
  get expirationDate() {
    return this.vaccineForm.get('expirationDate') as FormControl;
  }

  createSearchForm() {
    this.searchForm = new FormGroup({
      searchType: new FormControl(1, Validators.required),
      searchKeyword: new FormControl('', Validators.required)
    });
  }

  get searchType() {
    return this.searchForm.get('searchType') as FormControl;
  }
  get searchKeyword() {
    return this.searchForm.get('searchKeyword') as FormControl
  }

  loadVaccines() {
    this.vaccineService.getVaccines().subscribe({
      next: (response: Vaccine[]) => {
        this.vaccines = response;
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });
  }

  openAddVaccineModal() {
    this.isEditMode = false;
    this.popupTitle = 'Add Vaccine';
    this.vaccineForm.reset();
    this.vaccineForm.controls['vaccineId'].enable();
  }

  openEditVaccineModal(vaccine: Vaccine) {
    this.isEditMode = true;
    this.popupTitle = 'Edit Vaccine';
    this.vaccineForm.setValue({
      vaccineId: vaccine.VaccineId,
      vaccineName: vaccine.VaccineName,
      manufacturer: vaccine.Manufacturer,
      batchNumber: vaccine.BatchNumber,
      expirationDate: vaccine.ExpirationDate,
    });
    this.vaccineForm.controls['vaccineId'].disable();
  }

  onSearch() {
    var type = this.searchForm.value.searchType;
    var value = this.searchForm.value.searchKeyword;

    if (value == '') {
      const message = type == '1' ? 'Please enter a vaccine ID' : 'Please enter a vaccine name';
      this.showToast.showWarningMessage('Warning', message);
      return;
    }
    this.searchValue = value;

    if (type == '1') {
      this.searchByVaccineId(value);
    } else if (type == '2') {
      this.searchByVaccineName(value);
    }
  }

  searchByVaccineId(vaccineId: string) {
    this.vaccineService.getVaccineById(vaccineId).subscribe({
      next: (response) => {
        this.vaccines = [response];
        this.currentSearchUrl = `Search vaccine Id: ${vaccineId}`;
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
      },
    });
  }

  searchByVaccineName(vaccineName: string) {
    this.vaccineService.getVaccineByName(vaccineName).subscribe({
      next: (response) => {
        this.vaccines = response;
        this.currentSearchUrl = `Search vaccine Name: ${vaccineName}`;
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
      },
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showClearButton = input.value.length > 0;
  }

  clearSearch() {
    this.searchForm.get('searchKeyword')?.reset(); // Xóa giá trị trong ô input
    this.showClearButton = false; // Ẩn nút xóa
    this.currentSearchUrl = null;
  }

  submit(): void {
    if (this.vaccineForm.invalid) {
      this.showToast.showWarningMessage(
        'Warning',
        'Please complete all fields'
      );
      return;
    }

    const vaccineData = this.vaccineForm.getRawValue();
    console.log(vaccineData);
    console.log(this.isEditMode);

    if (this.isEditMode) {
      // Call the update vaccine service method
      this.vaccineService.updateVaccines(vaccineData).subscribe(() => {
        this.loadVaccines();
      });
    } else {
      // Call the add vaccine service method
      this.vaccineService.createVaccine(vaccineData).subscribe(() => {
        this.loadVaccines();
      });
    }

    this.vaccineForm.reset();
  }

  viewLogs(vaccineId: string) {
    this.popupTitle = 'View Logs for Vaccine ID: ' + vaccineId;

    this.statisticLogService.GetStatisticLog(vaccineId).subscribe({
      next: (response: VaccineDetail) => {
        //2024-08-03T16:46:17.6803832 converse and get only date in DateRangeStart
        response.DateRangeStart = this.formatDateService.toDateString(response.DateRangeStart);
        response.DateRangeEnd = this.formatDateService.toDateString(response.DateRangeEnd);

        // DateLowestValue and TimeLowestValue
        response.DateLowestValue = this.formatDateService.toDateString(response.DateLowestValue);
        response.DateHighestValue = this.formatDateService.toDateString(response.DateHighestValue);

        response.TimeLowestValue = this.formatDateService.toDateString(response.TimeLowestValue);
        response.TimeHighestValue = this.formatDateService.toDateString(response.TimeHighestValue);

        this.statisticLog = response;
      },
      error: (response: any) => {
        console.log("🚀 ~ ManageVaccineComponent ~ this.statisticLogService.GetStatisticLog ~ response:", response)
        // Show error message not found when 404 status
        if (response.status === 404) {
          this.showToast.showWarningMessage(
            'Warning',
            'This vaccine has no logs yet'
          );
        } else {
          this.showToast.showErrorMessage(
            'Error',
            response.error?.message ||
            'Something went wrong. Please try again later'
          );
        }
      },
    });
  }

  deleteVaccine(vaccineId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete vaccine "${vaccineId}"? This process cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vaccineService.deleteVaccine(vaccineId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The vaccine has been deleted.',
              'success'
            );
            this.loadVaccines(); // Refresh the vaccine list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the vaccine.',
              'error'
            );
            console.error(error);
          }
        });
      }
    });
  }
}
