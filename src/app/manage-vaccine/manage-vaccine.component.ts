import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../services/api/vaccine.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environment/environment';
import { NgFor, NgIf } from '@angular/common';
import { LogService } from '../services/api/log.service';
import { Log } from '../models/log';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { Device } from '../models/device';
import { Vaccine } from '../models/vaccine';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-vaccine',
  standalone: true,
  imports: [NgFor, NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-vaccine.component.html',
  styleUrl: './manage-vaccine.component.scss'
})
export class ManageVaccineComponent implements OnInit {
  vaccines: Vaccine[] = []
  logs: Log[] = [];
  popupTitle: string = '';
  vaccineForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private vaccineService: VaccineService,
    private showToast: ToastService,
  ) { }

  ngOnInit(): void {
    this.loadVaccines();
    this.initForm();
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

  loadVaccines() {
    this.vaccineService.getVaccines().subscribe({
      next: (response: Vaccine[]) => {
        console.log(response);
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
    const device: Device = {
      DeviceId: 'DEV001',
      Location: 'Device 1',
      SensorType: 1,
    };

    const vaccine: Vaccine = {
      VaccineId: vaccineId,
      VaccineName: 'Vaccine 1',
      Manufacturer: 'Manufacturer 1',
      BatchNumber: 'Batch 1',
      ExpirationDate: new Date().toISOString(),
    };

    this.logs = new Array<Log>();
    this.logs.push({
      Device: device,
      Vaccine: vaccine,
      Value: 2.5,
      Unit: 'C',
      Timestamp: new Date().toISOString(),
      Status: 1,
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
