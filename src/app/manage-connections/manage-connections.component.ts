import { Log } from './../models/log';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { LogService } from '../services/api/log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { handleToastErrors } from '../utils';
import Swal from 'sweetalert2';
import { VaccineService } from '../services/api/vaccine.service';
import { DeviceService } from '../services/api/device.service';
import { RouterLink } from '@angular/router';
import { Connection } from '../models/connection';
import { LOG_STATUS } from '../utils/constant';

@Component({
  selector: 'app-manage-connections',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    NgSwitch,
    AppApexChartLineComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-connections.component.html',
  styleUrl: './manage-connections.component.scss',
})
export class ManageConnectionsComponent implements OnInit {
  connectForm!: FormGroup;
  logs: Log[] = [];
  connections: Connection[] = [];
  devices: string[] = [];
  vaccines: string[] = [];
  isLightMode = true;
  form_title = 'Create Connection';
  form_button = 'Save';
  LOG_STATUS = LOG_STATUS;

  constructor(
    private logService: LogService,
    private vaccineService: VaccineService,
    private deviceService: DeviceService,
    private showToast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadConnections();
    this.initForm();
  }

  initForm() {
    this.connectForm = new FormGroup({
      vaccineId: new FormControl('', Validators.required),
      deviceId: new FormControl('', Validators.required),
    });
  }

  get vaccineId() {
    return this.connectForm.get('vaccineId') as FormControl;
  }

  get deviceId() {
    return this.connectForm.get('deviceId') as FormControl;
  }

  loadConnections() {
    // Get all vaccines and get only id to set in vaccine dropdown
    this.vaccineService.getVaccines().subscribe({
      next: (response) => {
        this.vaccines = response.map((v) => v.VaccineId);
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });

    // Get all devices and get only id to set in device dropdown
    this.deviceService.getDevices().subscribe({
      next: (response) => {
        this.devices = response.map((d) => d.DeviceId);
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });

    this.logService.getLogs().subscribe({
      next: (response: Log[]) => {
        const values = Object.values(LOG_STATUS);

        this.connections = response.map((log) => ({
          Status: values[log.Status],
          Device: log.Device,
          Vaccine: log.Vaccine,
        }));
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

  submit(): void {
    if (this.connectForm.invalid) {
      console.log('Invalid form');
      this.showToast.showWarningMessage(
        'Warning',
        'Please complete all fields'
      );
      return;
    }

    const deivceId = this.connectForm.value.deviceId;
    const vaccineId = this.connectForm.value.vaccineId;

    console.log('this.form_button ID:', this.form_button);
    if (this.form_button === 'Search') {
      this.searchConnection(deivceId, vaccineId);
    } else if (this.form_button === 'Save') {
      this.createConnection(deivceId, vaccineId);
    }else{
      // reset form with first selected value
      this.connectForm.reset();
    }
  }

  createConnection(deivceId: any, vaccineId: any) {
    //check if connection already exist
    const isExit = this.connections.find(
      (connection) =>
        connection.Device.DeviceId === deivceId &&
        connection.Vaccine.VaccineId === vaccineId
    );

    if (isExit) {
      this.showToast.showWarningMessage('Warning', 'Connection already exist');
      // CLEAR FORM and set hint
      // this.connectForm.reset();
      return;
    }

    this.logService.createLog(this.connectForm.value).subscribe({
      next: (response) => {
        this.showToast.showSuccessMessage(
          'Success',
          'Create connection successfully'
        );
        // this.connections.push(response);
        this.loadConnections(); // Refresh the vaccine list
        // CLEAR FORM
        this.connectForm.reset();
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
      },
    });
  }

  searchConnection(deivce: any, vaccine: any) {
    const connection = this.connections.find(
      (connection) =>
        connection.Device.DeviceId === deivce &&
        connection.Vaccine.VaccineId === vaccine
    );

    if (!connection) {
      this.showToast.showWarningMessage('Warning', 'Connection does not exist');
      return;
    }

    this.connections = [connection];
  }

  deleteConnect(vaccineId: string, deviceId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete connection between ${vaccineId} and ${deviceId}? \nThis process cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logService.deleteLog(deviceId, vaccineId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The connnection has been deleted.', 'success');
            this.loadConnections(); // Refresh the vaccine list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the connnection.',
              'error'
            );
            console.error(error);
          },
        });
      }
    });
  }

  updateConnect(vaccineId: string, deviceId: string) {
    const isExit = this.connections.find(
      (connection) =>
        connection.Device.DeviceId === deviceId &&
        connection.Vaccine.VaccineId === vaccineId
    );

    if (!isExit) {
      this.showToast.showWarningMessage('Warning', 'Connection does not exist');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to make this connection change to Collected?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logService.updateStatusLog(deviceId, vaccineId).subscribe({
          next: () => {
            Swal.fire('Updated!', 'The vaccine has been updated.', 'success');
            this.loadConnections(); // Refresh the vaccine list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error updating the vaccine.',
              'error'
            );
            console.error(error);
          },
        });
      }
    });
  }

  toggleTheme(): void {
    this.isLightMode = !this.isLightMode;
    const mainContent = document.getElementById('main_swap');
    if (this.isLightMode) {
      mainContent?.classList.remove('main_swap--dark');
      mainContent?.classList.add('main_swap--light');
      this.form_title = 'Create Connection';
      this.form_button = 'Save';
    } else {
      mainContent?.classList.remove('main_swap--light');
      mainContent?.classList.add('main_swap--dark');
      this.form_title = 'Search Connection';
      this.form_button = 'Search';
    }
  }
}
