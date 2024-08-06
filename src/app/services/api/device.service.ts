import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../../models/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  getDevices() {
    return this.http.get<Device[]>('/api/Devices');
  }

  getDeviceById(id: string) {
    return this.http.get<Device>(`/api/Devices/${id}`);
  }

  createDevice(Device: Device) {
    return this.http.post<Device>('/api/Devices', Device);
  }

  updateDevices(Device: Device) {
    return this.http.put<Device>(`https://localhost:7241/api/Devices/${Device.DeviceId}`, Device);
  }

  deleteDevice(id: string) {
    return this.http.delete<any>(`https://localhost:7241/api/Devices/${id}`);
  }
}
