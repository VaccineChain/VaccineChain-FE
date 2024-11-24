import { statisticAreaChart } from './../../../models/statisticAreaChart';
import { Vaccine } from './../../../models/vaccine';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ToastService } from "../../../services/toast.service";
import { StatisticLogService } from "../../../services/api/statistic-log.service";
import { TemperatureService } from '../../../services/api/temperature.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  NgApexchartsModule
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})

export class AppApexChartLineComponent implements OnChanges {
  @Input() vaccineId!: string | undefined;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  value!: number[];
  dates!: string[];
  name!: string[];
  apiData: statisticAreaChart[] = [];
  temperatureData:any = []; // Mảng để lưu dữ liệu nhận được

  constructor(
    private showToast: ToastService,
    private statisticLogService: StatisticLogService,
    private temperatureService: TemperatureService

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vaccineId'] && changes['vaccineId'].currentValue) {
      this.statisticLogs(changes['vaccineId'].currentValue);
    }
  }

  statisticLogs(Vaccine: string) {
    this.statisticLogService.GetStatisticsForAreaChart(Vaccine).subscribe({
      next: (response: statisticAreaChart[]) => {
        console.log(response);
        this.apiData = response;
        this.initChart();
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          "Error",
          response.error?.message ||
          "Something went wrong. Please try again later"
        );
      }
    });
  }

  initChart() {
    // Xử lý dữ liệu
    const seriesData = this.apiData.map(device => {
      return {
        name: device.DeviceId,
        data: device.SensorValue.map(entry => ({
          x: new Date(entry.Timestamp).getTime(),
          y: entry.Value
        }))
      };
    });

    // Lấy danh sách các ngày từ dữ liệu
    const dates = [...new Set(this.apiData.flatMap(device => device.SensorValue.map(entry => entry.Timestamp)))];

    // Cập nhật các tùy chọn cho biểu đồ
    this.chartOptions = {
      series: seriesData,
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Detailed Log Overview for Vaccine " + this.vaccineId,
        align: "left"
      },
      subtitle: {
        text: "Complete log history and analysis for this vaccine",
        align: "left"
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "dd/MM/yy HH:mm"
        }
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }
}


