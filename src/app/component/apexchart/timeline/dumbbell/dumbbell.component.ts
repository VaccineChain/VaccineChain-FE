import { VaccineResponse } from './../../../../models/dto/vaccineResponse';
import { Vaccine } from './../../../../models/vaccine';
import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

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
import { VaccineService } from '../../../../services/api/vaccine.service';

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
export class DumbbellChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  temperatureData: { vaccine: string; minTemp: number; maxTemp: number; }[] = [];

  constructor(private vaccineService: VaccineService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'rangeBar',
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          rangeBarGroupRows: true,
        },
      },
      colors: ['#EC7D31', '#36BDCB'],
      title: {
        text: 'Temperature Range for Vaccines',
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        customLegendItems: ['Min temperatures', 'Max temperatures'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          gradientToColors: ['#36BDCB'],
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

    this.proccessData(); // Gọi hàm xử lý dữ liệu
  }

  proccessData() {
    this.vaccineService.getVaccines().subscribe({
      next: (vaccines) => {
        console.log('Vaccines loaded', vaccines);
        const vaccineIds = vaccines.map((vaccine) => vaccine.VaccineId);

        // Tạo mảng các Observable getVaccineResponse
        const observables = vaccineIds.map((id) => this.vaccineService.getVaccineResponse(id));

        // Dùng forkJoin để chờ tất cả Observable hoàn thành
        forkJoin(observables).subscribe({
          next: (responses: any[]) => {
            // Lúc này responses là mảng chứa dữ liệu từ tất cả vaccine
            responses.forEach((response) => {
              const minTemp = this.processResponse(response.Data, 'min');
              const maxTemp = this.processResponse(response.Data, 'max');
              this.temperatureData.push({
                vaccine: response.Data[0].vaccine_id,
                minTemp: minTemp,
                maxTemp: maxTemp,
              });
            });

            // Cập nhật series sau khi dữ liệu đã xử lý
            this.chartOptions!.series = [
              {
                data: this.temperatureData.map((t) => ({
                  x: t.vaccine,
                  y: [t.minTemp, t.maxTemp],
                })),
              },
            ];
          },
          error: (err) => {
            console.error('Error loading vaccine responses', err);
          },
        });
      },
      error: (err) => {
        console.error('Error loading vaccines', err);
      },
    });
  }
  processResponse(response: any[], type: 'min' | 'max'): number {
    const values = response.map((r: any) => r.value);
    return type === 'min' ? Math.min(...values) : Math.max(...values);
  }
}
