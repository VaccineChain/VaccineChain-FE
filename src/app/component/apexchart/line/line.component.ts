import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';
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
  NgApexchartsModule,
} from 'ng-apexcharts';
import { VaccineResponse } from '../../../models/dto/vaccineResponse';
import { FormatDateService } from '../../../services/format-date.service';
import { interval, Subscription } from 'rxjs';

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
  styleUrls: ['./line.component.scss'],
})
export class AppApexChartLineComponent implements OnChanges, OnDestroy {
  @Input() vaccineResponse!: VaccineResponse[];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  private autoReloadSubscription!: Subscription; // For auto-reload

  constructor(private formatDateService: FormatDateService) {} // Inject FormatDateService

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['vaccineResponse'] &&
      changes['vaccineResponse'].currentValue !==
        changes['vaccineResponse'].previousValue
    ) {
      this.initChart();
    }

    // Start auto-reload when data changes
    if (!this.autoReloadSubscription) {
      this.startAutoReload();
    }
  }

  startAutoReload() {
    this.autoReloadSubscription = interval(3000).subscribe(() => {
      // Fetch or process data every 3 seconds and reinitialize the chart
      this.reloadData();
    });
  }

  reloadData() {
    // Replace this with your actual data fetching or processing logic
    console.log('Reloading data...');
    this.initChart(); // Reinitialize the chart with updated data
  }

  initChart() {
    // Group dữ liệu theo `deviceId`
    const groupedData = this.groupByDeviceId(this.vaccineResponse);
    console.log('Grouped data:', groupedData);

    // Xử lý dữ liệu thành định dạng cho ApexCharts
    const seriesData = Object.entries(groupedData).map(([deviceId, data]) => ({
      name: deviceId, // Tên của thiết bị
      data: data.map((entry: VaccineResponse) => ({
        x: this.correctTimestamp(entry.createdDate), // Chuyển đổi timestamp
        y: entry.value, // Giá trị của thiết bị
      })),
    }));

    // Cập nhật cấu hình biểu đồ
    this.chartOptions = {
      series: seriesData,
      chart: {
        type: 'area',
        height: 400,
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Detailed Log Overview',
        align: 'left',
      },
      subtitle: {
        text: 'Complete log history by device',
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (value) =>
            this.formatDateService.toCompactDateTimeString(
              new Date(value).toISOString()
            ),
        },
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: 'left',
      },
    };
  }

  private correctTimestamp(timestamp: any): number {
    if (timestamp instanceof Date) {
      return timestamp.getTime(); // Nếu đã là Date object, trả về timestamp
    }
    if (typeof timestamp === 'string') {
      // Nếu là chuỗi, cố gắng chuyển sang số và nhân với 1000 (nếu cần)
      const numericTimestamp = Number(timestamp);
      return numericTimestamp < 10000000000
        ? numericTimestamp * 1000
        : numericTimestamp;
    }
    return timestamp; // Nếu không chuyển đổi được, trả về giá trị gốc
  }

  private groupByDeviceId(data: VaccineResponse[]): {
    [key: string]: VaccineResponse[];
  } {
    return data.reduce(
      (acc: { [key: string]: VaccineResponse[] }, curr: VaccineResponse) => {
        if (!acc[curr.deviceId]) {
          acc[curr.deviceId] = [];
        }
        acc[curr.deviceId].push(curr);
        return acc;
      },
      {}
    );
  }

  ngOnDestroy() {
    // Hủy subscription khi component bị destroy
    if (this.autoReloadSubscription) {
      this.autoReloadSubscription.unsubscribe();
    }
  }
}
