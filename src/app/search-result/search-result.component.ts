import { VaccineResponse } from './../models/dto/vaccineResponse';
import { VaccineDetail } from './../models/vaccineDetail';
import { Component, OnInit } from '@angular/core';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { Vaccine } from '../models/vaccine';
import { Log } from '../models/log';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VaccineService } from '../services/api/vaccine.service';
import { ToastService } from '../services/toast.service';
import { StatisticLogService } from '../services/api/statistic-log.service';
import { FormatDateService } from '../services/format-date.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  vaccines: Vaccine[] = [];
  logs: Log[] = [];
  vaccineDetail!: VaccineDetail;
  vaccineResponse: VaccineResponse[] = [];
  popupTitle: string = '';
  vaccineForm!: FormGroup;
  isEditMode: boolean = false;
  showMore: boolean = false; // Default state

  constructor(
    private vaccineService: VaccineService,
    private showToast: ToastService,
    private statisticLogService: StatisticLogService,
    private formatDateService: FormatDateService,
    private route: ActivatedRoute // Thêm ActivatedRoute để lấy queryParams
  ) {}

  ngOnInit(): void {
    // Retrieve `listVaccine` from query parameters
    this.route.queryParams.subscribe(params => {
      this.vaccineResponse = JSON.parse(params['listVaccine'] || '[]').map((item: any) => ({
        vaccineId: item.vaccine_id,
        deviceId: item.device_id,
        value: Number(item.value),
        createdDate: new Date(item.created_date)
      }));

      if (this.vaccineResponse.length > 0) {
        console.log('Vaccine response:', this.vaccineResponse);
        const getVaccineId = this.vaccineResponse[0].vaccineId
        // Fetch full vaccine details based on VaccineID
        this.vaccineService.getVaccineById(getVaccineId).subscribe({
          next: (vaccine: Vaccine) => {
            console.log("🚀 ~ SearchResultComponent ~ this.vaccineService.getVaccineById ~ vaccine:", vaccine)
            vaccine.ExpirationDate = this.formatDateService.toFullDateTimeString(vaccine.ExpirationDate);
            this.processVaccineData(this.vaccineResponse, vaccine);
          },
          error: error => console.error('Error fetching vaccine details:', error)
        });
      }
    });
  }

  private processVaccineData(vaccineList: VaccineResponse[], vaccine: Vaccine) {
    const values = vaccineList.map(v => v.value);
    const timestamps = vaccineList.map(v => v.createdDate);

    // Calculate statistics
    const averageValue = this.calculateAverage(values);
    const highestValue = Math.max(...values);
    const lowestValue = Math.min(...values);
    const dateHighestValue = this.formatDateService.toDateString(new Date(timestamps[values.indexOf(highestValue)]).toISOString());
    const timeHighestValue = this.formatDateService.toTimeString(new Date(timestamps[values.indexOf(highestValue)]).toISOString());
    const dateLowestValue = this.formatDateService.toDateString(new Date(timestamps[values.indexOf(lowestValue)]).toISOString());
    const timeLowestValue = this.formatDateService.toTimeString(new Date(timestamps[values.indexOf(lowestValue)]).toISOString());
    var { dateRangeStart, dateRangeEnd } = this.processTimestamps(timestamps);

    dateRangeStart = this.formatDateService.toDateString(dateRangeStart);
    dateRangeEnd = this.formatDateService.toDateString(dateRangeEnd);

    // Set vaccine details
    this.vaccineDetail = {
      Vaccine: vaccine,
      DeviceId: [...new Set(vaccineList.map(v => v.deviceId))], // Unique DeviceIDs
      AverageValue: averageValue,
      HighestValue: highestValue,
      DateHighestValue: dateHighestValue,
      TimeHighestValue: timeHighestValue,
      LowestValue: lowestValue,
      DateLowestValue: dateLowestValue,
      TimeLowestValue: timeLowestValue,
      DateRangeStart: dateRangeStart,
      DateRangeEnd: dateRangeEnd,
      NumberRecords: vaccineList.length
    };
  }
  private processTimestamps(timestamps: Date[]): { dateRangeStart: string; dateRangeEnd: string } {
    const dates = timestamps.map(timestamp => new Date(timestamp));

    const startDate = new Date(Math.min(...dates.map(date => date.getTime())));
    const endDate = new Date(Math.max(...dates.map(date => date.getTime())));

    return {
      dateRangeStart: startDate.toISOString(),
      dateRangeEnd: endDate.toISOString(),
    };
  }

  private calculateAverage(values: number[]): number {
    const sum = values.reduce((total, value) => total + value, 0);
    return Number((sum / values.length).toFixed(2)); // Rounded to 2 decimal places
  }

  toggleShow(): void {
    this.showMore = !this.showMore;
  }
}
