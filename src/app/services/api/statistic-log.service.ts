import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VaccineDetail } from '../../models/vaccineDetail';
import { statisticAreaChart } from '../../models/statisticAreaChart';

@Injectable({
  providedIn: 'root'
})
export class StatisticLogService {

  constructor(private http: HttpClient) { }

  GetStatisticLog(vaccineId: string) {
    return this.http.get<VaccineDetail>(`/api/Statistic/Logs/${vaccineId}`);
  }

  GetStatisticsForAreaChart(vaccineId: string) {
    return this.http.get<statisticAreaChart[]>(`/api/Statistic/Area-Chart/${vaccineId}`);
  }
}
