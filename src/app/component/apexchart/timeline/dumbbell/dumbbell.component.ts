import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { StatisticLogService } from '../../../../services/api/statistic-log.service';
import { VaccinesTemperatureRange } from '../../../../models/statisticAreaChart';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  stroke: ApexStroke | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  colors: string[] | any;
  fill: ApexFill | any;
  legend: ApexLegend | any;
  title: ApexTitleSubtitle | any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-dumbbell-chart',
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
  templateUrl: './dumbbell.component.html',
  styleUrl: './dumbbell.component.scss',
})
export class DumbbellChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;

  constructor(private statisticLogService: StatisticLogService) {
    this.chartOptions = {
      series: [],
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
        customLegendItems: ['Lowest Temperature', 'Highest Temperature'],
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

  ngOnInit(): void {
    this.proccessData();
  }

  proccessData() {
    this.statisticLogService.GetVaccinesTemperatureRange().subscribe({
      next: (vaccinesTemperatureRange: VaccinesTemperatureRange[]) => {
        this.chartOptions!.series = [
          {
            data: vaccinesTemperatureRange.map(
              (t: VaccinesTemperatureRange) => ({
                x: t.VaccineName,
                y: [t.LowestTemperature, t.HighestTemperature],
              })
            ),
          },
        ];
      },
      error: (err) => {
        console.error('Error loading vaccines', err);
      },
    });
  }
}
