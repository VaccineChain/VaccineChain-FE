import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { statisticLogsByVaccineId } from '../../models/statisticLogsByVaccineId';
import { statisticAreaChart } from '../../models/statisticAreaChart';

@Injectable({
  providedIn: 'root'
})
export class StatisticLogService {

  constructor(private http: HttpClient) { }

  GetStatisticLog(vaccineId: string) {
    return this.http.get<statisticLogsByVaccineId>(`https://localhost:7241/api/Statistic/Logs/${vaccineId}`);
  }

  GetStatisticsForAreaChart(vaccineId: string) {
    return this.http.get<statisticAreaChart[]>(`https://localhost:7241/api/Statistic/Area-Chart/${vaccineId}`);
  }
}
