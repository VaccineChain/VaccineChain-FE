import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { LogService } from '../services/api/log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Log } from '../models/log';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { handleToastErrors } from '../utils';
import Swal from 'sweetalert2';
import { VaccineService } from '../services/api/vaccine.service';
import { DeviceService } from '../services/api/device.service';
import { RouterLink } from '@angular/router';
import { Connection } from '../models/connection';

@Component({
  selector: 'app-manage-connections',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgSwitch, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-connections.component.html',
  styleUrl: './manage-connections.component.scss'
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

  constructor(
    private logService: LogService,
    private vaccineService: VaccineService,
    private deviceService: DeviceService,
    private showToast: ToastService,
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
        console.log(response);
        this.connections = response;
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
      console.log("Invalid form");
      this.showToast.showWarningMessage(
        'Warning',
        'Please complete all fields'
      );
      return;
    }

    const isExit = this.connections.find((connection) => connection.Device.DeviceId === this.connectForm.value.deviceId && connection.Vaccine.VaccineId === this.connectForm.value.vaccineId);

    if (isExit) {
      this.showToast.showWarningMessage(
        'Warning',
        'Connection already exists'
      );
      return;
    }

    this.logService.createLog(this.connectForm.value).subscribe({
      next: (response) => {
        this.showToast.showSuccessMessage(
          'Success',
          'Create connection successfully'
        );
        this.connections.push(response);
        // CLEAR FORM
        this.connectForm.reset();
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
      },
    });
  }

  deleteConnect(vaccineId: string, deviceId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete vaccine ${vaccineId}? This process cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logService.deleteLog(deviceId, vaccineId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The vaccine has been deleted.',
              'success'
            );
            this.loadConnections(); // Refresh the vaccine list
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


  toggleTheme(): void {
    this.isLightMode = !this.isLightMode;
    const mainContent = document.getElementById("main_swap");
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

