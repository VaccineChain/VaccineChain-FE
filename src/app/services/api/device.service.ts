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
    return this.http.get<Device>(`/api/Devices/GetById?deviceId=${id}`);
  }

  getDeviceByName(name: string) {
    return this.http.get<Device[]>(`/api/Devices/GetById?deviceName=${name}`);
  }
  createDevice(Device: Device) {
    return this.http.post<Device>('/api/Devices', Device);
  }

  updateDevices(Device: Device) {
    return this.http.put<Device>(`/api/Devices/${Device.DeviceId}`, Device);
  }

  deleteDevice(id: string) {
    return this.http.delete<any>(`/api/Devices/${id}`);
  }
}
