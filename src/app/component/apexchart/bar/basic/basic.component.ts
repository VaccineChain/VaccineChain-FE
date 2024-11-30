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
  imports: [NgApexchartsModule],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
})
export class BasicBarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  connectionData = {
    totalConnections: 50,
    notConnectedDevices: 20,
    notConnectedVaccines: 10,
  };

  constructor() {
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
