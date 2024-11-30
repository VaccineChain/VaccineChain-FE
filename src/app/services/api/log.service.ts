import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../../models/log';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  getLogs() {
    return this.http.get<Log[]>(`/api/Logs`);
  }

  getLogById(id: string) {
    return this.http.get<Log>(`/api/Logs/${id}`);
  }

  createLog(log: Log) {
    return this.http.post<Log>('/api/Logs', log);
  }

  updateStatusLog(deviceId: string, vaccineId: string) {
    const body = {
      deviceId: deviceId,
      vaccineId: vaccineId,
    };
    return this.http.put<Log>('/api/Logs/UpdateStatus', body);
  }

  deleteLog(deviceId: string, vaccineId: string) {
    const params = new HttpParams({
      fromObject: {
        deviceId: deviceId,
        vaccineId: vaccineId,
      },
    });
    return this.http.delete<Log>('/api/Logs', { params });
  }

  isExistConnection(deviceId: string, vaccineId: string) {
    const params = new HttpParams({
      fromObject: {
        deviceId: deviceId,
        vaccineId: vaccineId,
      },
    });

    return this.http.post<Log>('/api/Logs/GetExistConnection', params);
  }
}
