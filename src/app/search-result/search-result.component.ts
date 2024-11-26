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
      const vaccineList = JSON.parse(params['listVaccine'] || '[]');

      if (vaccineList.length > 0) {
        const selectedVaccine = vaccineList[0]; // Take the first vaccine in the list

        // Fetch full vaccine details based on VaccineID
        this.vaccineService.getVaccineById(selectedVaccine.vaccine_id).subscribe({
          next: (vaccine: Vaccine) => {
            console.log("🚀 ~ SearchResultComponent ~ this.vaccineService.getVaccineById ~ vaccine:", vaccine)

            this.processVaccineData(vaccineList, vaccine);
          },
          error: error => console.error('Error fetching vaccine details:', error)
        });
      }
    });
  }

  private processVaccineData(vaccineList: any[], vaccine: Vaccine) {
    const values = vaccineList.map(v => v.value);
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ values:", values)
    const timestamps = vaccineList.map(v => v.created_date);
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ timestamps:", timestamps)

    // Calculate statistics
    const averageValue = this.calculateAverage(values);
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ averageValue:", averageValue)
    const highestValue = Math.max(...values);
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ highestValue:", highestValue)
    const lowestValue = Math.min(...values);
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ lowestValue:", lowestValue)
    const dateHighestValue = this.formatDateService.toDateString(new Date(timestamps[values.indexOf(highestValue)]).toISOString());
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ dateHighestValue:", dateHighestValue)
    const timeHighestValue = this.formatDateService.toTimeString(new Date(timestamps[values.indexOf(highestValue)]).toISOString());
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ timeHighestValue:", timeHighestValue)
    const dateLowestValue = this.formatDateService.toDateString(new Date(timestamps[values.indexOf(lowestValue)]).toISOString());
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ dateLowestValue:", dateLowestValue)
    const timeLowestValue = this.formatDateService.toTimeString(new Date(timestamps[values.indexOf(lowestValue)]).toISOString());
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ timeLowestValue:", timeLowestValue)
    var { dateRangeStart, dateRangeEnd } = this.processTimestamps(timestamps);

    dateRangeStart = this.formatDateService.toDateString(dateRangeStart);
    dateRangeEnd = this.formatDateService.toDateString(dateRangeEnd);

    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ dateRangeStart:", dateRangeStart)
    console.log("🚀 ~ SearchResultComponent ~ processVaccineData ~ dateRangeEnd:", dateRangeEnd)

    // Set vaccine details
    this.vaccineDetail = {
      Vaccine: vaccine,
      DeviceId: [...new Set(vaccineList.map(v => v.device_id))], // Unique DeviceIDs
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
  private processTimestamps(timestamps: string[]): { dateRangeStart: string; dateRangeEnd: string } {
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
