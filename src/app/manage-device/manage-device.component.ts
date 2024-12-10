import { Device } from './../models/device';
import { RouterLink } from '@angular/router';
import { DeviceService } from './../services/api/device.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { NgFor, NgIf } from '@angular/common';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { handleToastErrors } from '../utils';

@Component({
  selector: 'app-manage-device',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './manage-device.component.html',
  styleUrl: './manage-device.component.scss',
})
export class ManageDeviceComponent implements OnInit {
  devices: Device[] = [];
  popupTitle: string = '';
  deviceForm!: FormGroup;
  isEditMode: boolean = false;
  sensorTypes: string[] = [
    'Temperature Sensor',
    'Humidity Sensor',
    'Light Sensor',
  ]; // example sensor types
  searchForm!: FormGroup;
  selectSearchOption: any = [
    { id: 1, name: 'Device ID' },
    { id: 2, name: 'Location' },
    { id: 3, name: 'Sensor Type' },
  ];
  searchValue: string = '';
  currentSearchUrl: string | null = null;
  showClearButton = false;

  constructor(
    private deviceService: DeviceService,
    private showToast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadDevices();
    this.initForm();
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = new FormGroup({
      searchType: new FormControl(1, Validators.required),
      searchKeyword: new FormControl('', Validators.required),
    });
  }

  get searchType() {
    return this.searchForm.get('searchType') as FormControl;
  }
  get searchKeyword() {
    return this.searchForm.get('searchKeyword') as FormControl;
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
    DeviceData.sensorType = Number(DeviceData.sensorType);

    if (this.isEditMode) {
      // Convert to Device Model
      DeviceData.SensorType = DeviceData.sensorType;
      DeviceData.DeviceId = DeviceData.deviceId;
      DeviceData.Location = DeviceData.location;

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
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deviceService.deleteDevice(deviceId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The device has been deleted.', 'success');
            this.loadDevices(); // Refresh the Device list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the device.',
              'error'
            );
            console.error(error);
          },
        });
      }
    });
  }

  onSearch() {
    var type = this.searchForm.value.searchType;
    var value = this.searchForm.value.searchKeyword;

    if (value == '') {
      const message =
        type == '1'
          ? 'Please enter a vaccine ID'
          : 'Please enter a vaccine name';
      this.showToast.showWarningMessage('Warning', message);
      return;
    }
    this.searchValue = value;

    //check search type and filter the devices
    if (type == 1) {
      this.devices = this.devices.filter((device) =>
        device.DeviceId.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type == 2) {
      this.devices = this.devices.filter((device) =>
        device.Location.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type == 3) {
      this.devices = this.devices.filter((device) =>
        device.SensorType.toString().toLowerCase().includes(value.toLowerCase())
      );
    }
  }


  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    // Nếu có giá trị thì gọi ham search còn không thì load dữu liệu củ
    if (input.value) {
      this.showClearButton = true;
      this.onSearch();
    } else {
      this.showClearButton = false;
      this.loadDevices();
    }
  }

  clearSearch() {
    this.searchForm.get('searchKeyword')?.reset(); // Xóa giá trị trong ô input
    this.showClearButton = false; // Ẩn nút xóa
    this.currentSearchUrl = null;
  }
}
