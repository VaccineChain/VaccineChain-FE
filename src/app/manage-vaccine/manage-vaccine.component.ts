import { Vaccine } from './../models/vaccine';
import { FormatDateService } from './../services/format-date.service';
import { StatisticLogService } from './../services/api/statistic-log.service';
import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../services/api/vaccine.service';
import { ToastService } from '../services/toast.service';
import { NgFor, NgIf } from '@angular/common';
import { Log } from '../models/log';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VaccineDetail } from '../models/vaccineDetail';
import { handleToastErrors } from '../utils';
import { VaccineResponse } from '../models/dto/vaccineResponse';

@Component({
  selector: 'app-manage-vaccine',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-vaccine.component.html',
  styleUrl: './manage-vaccine.component.scss'
})
export class ManageVaccineComponent implements OnInit {
  vaccines: Vaccine[] = [];
  vaccineResponse: VaccineResponse[] = [];
  logs: Log[] = [];
  statisticLog: VaccineDetail | undefined;
  popupTitle: string = '';
  vaccineForm!: FormGroup;
  isEditMode: boolean = false;
  searchForm!: FormGroup;
  selectSearchOption: any = [
    { id: 1, name: 'Vaccine ID' },
    { id: 2, name: 'Vaccine Name' },
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

        // load logs for each vaccine
        this.vaccines.forEach((vaccine) => {
          this.loadLogs(vaccine.VaccineId);
        });
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

  loadLogs(vaccineId: string) {
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

        this.vaccineResponse = this.vaccineResponse.map((item: any) => ({
          vaccineId: item.vaccine_id,
          deviceId: item.device_id,
          value: Number(item.value),
          createdDate: new Date(item.created_date),
        }));

        console.log('Vaccine data:', this.vaccineResponse);
      },
      error: (error) => {
        console.error('Error fetching vaccine data:', error);
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
        //check if the vaccineId is not found
        if (response == null) {
          this.showToast.showWarningMessage(
            'Warning',
            'Vaccine ID not found'
          );
        }
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
    if (input.value.length > 0) {
      this.onSearch();
    } else {
      this.loadVaccines();
    }
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
    console.log(vaccineData.vaccineId);
    console.log(this.isEditMode);

    if (this.isEditMode) {
      // Convert to Vaccine model
      vaccineData.VaccineId = vaccineData.vaccineId;
      vaccineData.VaccineName = vaccineData.vaccineName;
      vaccineData.Manufacturer = vaccineData.manufacturer;
      vaccineData.BatchNumber = vaccineData.batchNumber;
      vaccineData.ExpirationDate = vaccineData.expirationDate;

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

    // Fetch full vaccine details based on VaccineID
    this.vaccineService.getVaccineById(vaccineId).subscribe({
      next: (vaccine: Vaccine) => {
        vaccine.ExpirationDate = this.formatDateService.toFullDateTimeString(
          vaccine.ExpirationDate
        );
        this.processVaccineData(this.vaccineResponse, vaccine);

        this.loadVaccineResponse(vaccineId); // Tải lại dữ liệu vaccineResponse

      },
      error: (error) => console.error('Error fetching vaccine details:', error),
    });
  }

  //tự động load sau 3s
  loadVaccineResponse(vaccineId: string) {
    this.vaccineService.getVaccineResponse(vaccineId).subscribe({
      next: (response: any) => {
        this.vaccineResponse = response.Data;
        console.log('Vaccine response data:', this.vaccineResponse);

        // Convert timestamp UNIX thành Date
        this.vaccineResponse = this.vaccineResponse.map((item: any) => ({
          vaccineId: item.vaccine_id,
          deviceId: item.device_id,
          value: Number(item.value),
          createdDate: new Date(item.created_date * 1000), // Chuyển timestamp UNIX thành Date
        }));

        console.log('Processed vaccine response:', this.vaccineResponse);
      },
      error: (error) => {
        console.error('Error fetching vaccine response:', error);
        this.showToast.showErrorMessage(
          'Error',
          'Could not load vaccine data. Please try again later.'
        );
      }
    });
  }


  private processVaccineData(vaccineList: VaccineResponse[], vaccine: Vaccine) {
    const values = vaccineList.map((v) => v.value);
    const timestamps = vaccineList.map((v) => v.createdDate);

    // Calculate statistics
    const averageValue = this.calculateAverage(values);
    const highestValue = Math.max(...values);
    const lowestValue = Math.min(...values);
    const dateHighestValue = this.formatDateService.toDateString(
      new Date(timestamps[values.indexOf(highestValue)]).toISOString()
    );
    const timeHighestValue = this.formatDateService.toTimeString(
      new Date(timestamps[values.indexOf(highestValue)]).toISOString()
    );
    const dateLowestValue = this.formatDateService.toDateString(
      new Date(timestamps[values.indexOf(lowestValue)]).toISOString()
    );
    const timeLowestValue = this.formatDateService.toTimeString(
      new Date(timestamps[values.indexOf(lowestValue)]).toISOString()
    );
    var { dateRangeStart, dateRangeEnd } = this.processTimestamps(timestamps);

    dateRangeStart = this.formatDateService.toDateString(dateRangeStart);
    dateRangeEnd = this.formatDateService.toDateString(dateRangeEnd);

    // Set vaccine details
    this.statisticLog = {
      Vaccine: vaccine,
      DeviceId: [...new Set(vaccineList.map((v) => v.deviceId))], // Unique DeviceIDs
      AverageValue: averageValue,
      HighestValue: highestValue,
      DateHighestValue: dateHighestValue,
      TimeHighestValue: timeHighestValue,
      LowestValue: lowestValue,
      DateLowestValue: dateLowestValue,
      TimeLowestValue: timeLowestValue,
      DateRangeStart: dateRangeStart,
      DateRangeEnd: dateRangeEnd,
      NumberRecords: vaccineList.length,
    };
  }

  private processTimestamps(timestamps: Date[]): {
    dateRangeStart: string;
    dateRangeEnd: string;
  } {
    const dates = timestamps.map((timestamp) => new Date(timestamp));

    const startDate = new Date(
      Math.min(...dates.map((date) => date.getTime()))
    );
    const endDate = new Date(Math.max(...dates.map((date) => date.getTime())));

    return {
      dateRangeStart: startDate.toISOString(),
      dateRangeEnd: endDate.toISOString(),
    };
  }

  private calculateAverage(values: number[]): number {
    const sum = values.reduce((total, value) => total + value, 0);
    return Number((sum / values.length).toFixed(2)); // Rounded to 2 decimal places
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
