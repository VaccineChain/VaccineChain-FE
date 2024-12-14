import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { StatisticLogService } from '../../../../services/api/statistic-log.service';
import { GetDataCollectionStatus } from '../../../../models/statisticAreaChart';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-stacked-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './stacked.component.html',
  styleUrl: './stacked.component.scss',
})
export class StackedBarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private statisticLogService: StatisticLogService) {}

  ngOnInit(): void {
    this.proccessData();
  }

  proccessData() {
    this.statisticLogService.GetDataCollectionStatus().subscribe({
      next: (dataCollectionStatus: GetDataCollectionStatus[]) => {
        this.chartOptions = {
          series: [
            {
              name: 'Collecting',
              data: dataCollectionStatus.map((c) => c.Collecting),
            },
            {
              name: 'Completed',
              data: dataCollectionStatus.map((c) => c.Completed),
            },
          ],
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff'],
          },
          title: {
            text: 'Data Collection Status',
          },
          xaxis: {
            categories: dataCollectionStatus.map((status) => status.Category),
            labels: {
              formatter: function (val) {
                return val.toString();
              },
            },
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val.toString();
              },
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
          },
        };
      },
      error: (err) => {
        console.error('Error loading vaccines', err);
      },
    });
  }
}
