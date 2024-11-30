import { Component, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

@Component({
  selector: 'app-dumbbell-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dumbbell.component.html',
  styleUrl: './dumbbell.component.scss',
})
export class DumbbellChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  temperatureData = [
    { vaccine: 'COVID-19 Vaccine', minTemp: 20.1, maxTemp: 30.3 },
    { vaccine: 'Flu Vaccine', minTemp: 24.1, maxTemp: 26.1 },
    { vaccine: 'AstraZeneca', minTemp: 20.5, maxTemp: 25 },
  ];

  constructor() {
    this.chartOptions = {
      series: [
        {
          data: this.temperatureData.map((t) => ({
            x: t.vaccine,
            y: [t.minTemp, t.maxTemp],
          })),
        },
      ],
      chart: {
        height: 390,
        type: 'rangeBar',
        zoom: {
          enabled: false,
        },
      },
      colors: ['#EC7D31', '#36BDCB'],
      plotOptions: {
        bar: {
          horizontal: true,
          isDumbbell: true,
          dumbbellColors: [['#EC7D31', '#36BDCB']],
        },
      },
      title: {
        text: 'Temperature Range for Vaccines',
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'left',
        customLegendItems: ['Min temperatures', 'Max temperatures'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          gradientToColors: ['#36BDCB'],
          inverseColors: false,
          stops: [0, 100],
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
    };
  }
}
