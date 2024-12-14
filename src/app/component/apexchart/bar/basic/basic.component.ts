import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { StatisticLogService } from '../../../../services/api/statistic-log.service';
import { ConnectionOverview } from '../../../../models/statisticAreaChart';

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
export class BasicBarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | undefined;

  constructor(private statisticLogService: StatisticLogService) {}

  ngOnInit(): void {
    this.proccessData();
  }

  proccessData() {
    this.statisticLogService.GetConnectionOverview().subscribe({
      next: (connectionOverview: ConnectionOverview) => {
        console.log(
          '🚀 ~ BasicBarChartComponent ~ this.statisticLogService.GetConnectionOverview ~ connectionOverview:',
          connectionOverview
        );
        this.chartOptions = {
          series: [
            {
              name: 'Connections',
              data: [
                connectionOverview.TotalConnection,
                connectionOverview.NotConnectedDevice,
                connectionOverview.NotConnectedVaccine,
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
      },
      error: (err) => {
        console.error('Error loading vaccines', err);
      },
    });
  }
}
