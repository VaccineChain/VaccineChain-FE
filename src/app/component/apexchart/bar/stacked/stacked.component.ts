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
  public chartOptions: Partial<ChartOptions>;
  collectionStatus = [
    { category: 'Devices', collecting: 50, completed: 150 },
    { category: 'Vaccines', collecting: 30, completed: 90 },
  ];

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Collecting',
          data: this.collectionStatus.map((c) => c.collecting),
        },
        {
          name: 'Completed',
          data: this.collectionStatus.map((c) => c.completed),
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
        categories: this.collectionStatus.map((c) => c.category),
        labels: {
          formatter: function (val) {
            return val + 'K';
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
            return val + 'K';
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
  }
}
