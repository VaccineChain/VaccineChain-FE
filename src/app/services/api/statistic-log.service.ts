import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VaccineDetail } from '../../models/vaccineDetail';
import {
  ConnectionOverview,
  GetDataCollectionStatus,
  statisticAreaChart,
  VaccineDeviceStatus,
  VaccinesTemperatureRange,
} from '../../models/statisticAreaChart';

@Injectable({
  providedIn: 'root',
})
export class StatisticLogService {
  constructor(private http: HttpClient) {}

  GetStatisticLog(vaccineId: string) {
    return this.http.get<VaccineDetail>(`/api/Statistic/Logs/${vaccineId}`);
  }

  GetVaccineDeviceStatus() {
    return this.http.get<VaccineDeviceStatus[]>(
      `/api/Statistic/Vaccine-Device-Status`
    );
  }

  GetStatisticsForAreaChart(vaccineId: string) {
    return this.http.get<statisticAreaChart[]>(
      `/api/Statistic/Area-Chart/${vaccineId}`
    );
  }

  GetVaccinesTemperatureRange() {
    return this.http.get<VaccinesTemperatureRange[]>(
      `/api/Statistic/Vaccines-Temperature-Range`
    );
  }

  GetDataCollectionStatus() {
    return this.http.get<GetDataCollectionStatus[]>(
      `/api/Statistic/Data-Collection-Status`
    );
  }

  GetConnectionOverview() {
    return this.http.get<ConnectionOverview>(
      `/api/Statistic/Connection-Overview`
    );
  }
}
