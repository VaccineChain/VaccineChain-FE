import { Component, OnInit } from '@angular/core';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { statisticLogsByVaccineId } from '../models/statisticLogsByVaccineId';
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
  statisticLog!: statisticLogsByVaccineId;
  popupTitle: string = '';
  vaccineForm!: FormGroup;
  isEditMode: boolean = false;
  showMore: boolean = false; // Default state

  toggleShow() {
    this.showMore = !this.showMore;
  }

  constructor(
    private vaccineService: VaccineService,
    private showToast: ToastService,
    private statisticLogService: StatisticLogService,
    private formatDateService: FormatDateService,
    private route: ActivatedRoute // Thêm ActivatedRoute để lấy queryParams
  ) {}

  ngOnInit(): void {
    // Lấy vaccineId từ queryParams
    this.route.queryParams.subscribe((params) => {
      const vaccineId = params['vaccineId'];
      if (vaccineId) {
        this.loadVaccines(vaccineId);
      }
    });
  }

  loadVaccines(vaccineId: string) {
    this.popupTitle = 'View Logs for Vaccine ID: ' + vaccineId;

    this.statisticLogService.GetStatisticLog(vaccineId).subscribe({
      next: (response: statisticLogsByVaccineId) => {
        //2024-08-03T16:46:17.6803832 converse and get only date in DateRangeStart
        response.DateRangeStart = this.formatDateService.toDateString(
          response.DateRangeStart
        );
        response.DateRangeEnd = this.formatDateService.toDateString(
          response.DateRangeEnd
        );
        response.Vaccine.ExpirationDate = this.formatDateService.toDateString(
          response.Vaccine.ExpirationDate
        );

        // DateLowestValue and TimeLowestValue
        response.DateLowestValue = this.formatDateService.toDateString(
          response.TimeLowestValue
        );
        response.DateHighestValue = this.formatDateService.toDateString(
          response.TimeHighestValue
        );

        this.statisticLog = response;
        this.statisticLog.TimeLowestValue = this.formatDateService.toTimeString(
          response.TimeLowestValue
        );
        this.statisticLog.TimeHighestValue =
          this.formatDateService.toTimeString(response.TimeHighestValue);

        console.log(
          '🚀 ~ SearchResultComponent ~ loadVaccines ~ this.statisticLog',
          this.statisticLog
        );
      },
      error: (response: any) => {
        console.log(
          '🚀 ~ ManageVaccineComponent ~ this.statisticLogService.GetStatisticLog ~ response:',
          response
        );
        // Show error message not found when 404 status
        if (response.status === 404) {
          this.showToast.showWarningMessage(
            'Warning',
            'This vaccine has no logs yet'
          );
        } else {
          this.showToast.showErrorMessage(
            'Error',
            response.error?.message ||
              'Something went wrong. Please try again later'
          );
        }
      },
    });
  }
}
