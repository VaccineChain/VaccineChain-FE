import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { LogService } from '../../../../services/api/log.service';
import { LOG_STATUS } from '../../../../utils/constant';
import { Log } from '../../../../models/log';
import { Connection } from '../../../../models/connection';
import { ToastService } from '../../../../services/toast.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-basic-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
})
export class BasicBarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | undefined;
  connections: Connection[] = [];

  connectionData = {
    totalConnections: 50,
    notConnectedDevices: 20,
    notConnectedVaccines: 10,
  };

  constructor(
    private logService: LogService,
    private showToast: ToastService
  ) {
    this.proccessData();
    this.initChart();
  }

  proccessData() {
    this.logService.getLogs().subscribe({
      next: (response: Log[]) => {
        const values = Object.values(LOG_STATUS);

        this.connections = response.map((log) => ({
          Status: values[log.Status],
          Device: log.Device,
          Vaccine: log.Vaccine,
        }));

        console.log('Connections:', this.connections);
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
  initChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Connections',
          data: [
            this.connectionData.totalConnections,
            this.connectionData.notConnectedDevices,
            this.connectionData.notConnectedVaccines,
          ],
        },
      ],
      title: {
        text: 'Connections Overview',
      },
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          'Total Connections',
          'Not Connected Devices',
          'Not Connected Vaccines',
        ],
      },
    };
  }
}
