import { DeviceService } from './../services/api/device.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environment/environment';
import { NgFor, NgIf } from '@angular/common';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { Device } from '../models/device';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-device',
  standalone: true,
  imports: [NgFor, NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-device.component.html',
  styleUrl: './manage-device.component.scss'
})

export class ManageDeviceComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  devices: Device[] = []
  popupTitle: string = '';
  deviceForm!: FormGroup;
  isEditMode: boolean = false;
  sensorTypes: string[] = ['Temperature Sensor', 'Humidity Sensor', 'Light Sensor']; // example sensor types


  constructor(
    private deviceService: DeviceService,
    private showToast: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.loadDevices();
    this.initForm();
  }

  initForm() {
    this.deviceForm = new FormGroup({
      deviceId: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      sensorType: new FormControl('', Validators.required),
    });
  }

  get deviceId() {
    return this.deviceForm.get('deviceId') as FormControl;
  }

  get location() {
    return this.deviceForm.get('location') as FormControl;
  }

  get sensorType() {
    return this.deviceForm.get('sensorType') as FormControl;
  }


  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (response: Device[]) => {
        console.log(response);
        this.devices = response;
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

  openAddDeviceModal() {
    this.isEditMode = false;
    this.popupTitle = 'Add Device';
    this.deviceForm.reset();
    this.deviceForm.controls['deviceId'].enable();
  }

  openEditDeviceModal(device: Device) {
    this.isEditMode = true;
    this.popupTitle = 'Edit Device';
    this.deviceForm.setValue({
      deviceId: device.DeviceId,
      location: device.Location,
      sensorType: device.SensorType,
    });
    console.log(this.deviceForm);
    this.deviceForm.controls['deviceId'].disable();
  }

  submit(): void {
    if (this.deviceForm.invalid) {
      this.showToast.showWarningMessage(
        'Warning',
        'Please complete all fields'
      );
      return;
    }

    const DeviceData = this.deviceForm.getRawValue();
    DeviceData.sensorType = this.sensorTypes.findIndex((sensorType) => sensorType === DeviceData.SensorType) + 1;

    if (this.isEditMode) {
      console.log(DeviceData);

      // Call the update Device service method
      this.deviceService.updateDevices(DeviceData).subscribe(() => {
        this.loadDevices();
      });
    } else {
      // Call the add Device service method
      this.deviceService.createDevice(DeviceData).subscribe(() => {
        this.loadDevices();
      });
    }

    this.deviceForm.reset();
  }

  deleteDevice(deviceId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete device ${deviceId}? This process cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deviceService.deleteDevice(deviceId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The device has been deleted.',
              'success'
            );
            this.loadDevices(); // Refresh the Device list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the device.',
              'error'
            );
            console.error(error);
          }
        });
      }
    });
  }
}
