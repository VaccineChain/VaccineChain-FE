import { NgIf } from '@angular/common';
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
  import { VaccineService } from '../../../../services/api/vaccine.service';
  import { Vaccine } from '../../../../models/vaccine';

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
    imports: [NgApexchartsModule, NgIf],
    templateUrl: './dumbbell.component.html',
    styleUrl: './dumbbell.component.scss',
  })
  export class DumbbellChartComponent {
    @ViewChild('chart') chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions> | undefined;

    temperatureData: { vaccine: string; minTemp: any; maxTemp: any; }[] = [];

    constructor(
      private vaccineService: VaccineService,
    ) {
      console.log('DumbbellChartComponent constructor');
      this.proccessData();
      this.initChart();
    }

    proccessData() {
      this.vaccineService.getVaccines().subscribe({
        next: (vaccines) => {
          console.log('Vaccines loaded', vaccines);
          //get log of each vaccine to find the min and max temperature by function this.getLog() in this file
          this.temperatureData = vaccines.map((vaccine) => ({
            vaccine: vaccine.VaccineName,
            minTemp: this.getLog(vaccine, "min"),
            maxTemp: this.getLog(vaccine, "max"),
          }));
          console.log('Vaccines', this.temperatureData);

        },
        error: (err) => {
          console.error('Error loading vaccines', err);
        },
      });
    }

    getLog(vaccine: Vaccine, arg1: string): any {
      return this.vaccineService.getVaccineResponse(vaccine.VaccineId).subscribe({
        next: (response: any) => {
          console.log('Vaccine response loaded', response);
          if (arg1 === "min") {
            //print
            console.log("Min temperature for " + vaccine.VaccineName + " is: " + Math.min(...response.map((r: any) => r.value)));

            return Math.min(...response.map((r: any) => r.value));
          } else {
            //print
            console.log("Max temperature for " + vaccine.VaccineName + " is: " + Math.max(...response.map((r: any) => r.value)));

            return Math.max(...response.map((r: any) => r.value));
          }
        },
        error: (err) => {
          console.error('Error loading vaccines', err);
        },
      });
    }

    initChart() {
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
            rangeBarGroupRows: true,
          },
        },
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
    }

  }
