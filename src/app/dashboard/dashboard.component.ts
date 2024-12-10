import { VaccineService } from './../services/api/vaccine.service';
import { Component } from '@angular/core';
import { AppApexChartColumnComponent } from '../component/apexchart/column/column.component';
import { RouterLink } from '@angular/router';
import { DumbbellChartComponent } from '../component/apexchart/timeline/dumbbell/dumbbell.component';
import { BasicBarChartComponent } from '../component/apexchart/bar/basic/basic.component';
import { StackedBarChartComponent } from '../component/apexchart/bar/stacked/stacked.component';
import { StatisticComponent } from "../component/table/statistic/statistic.component";
import { DeviceService } from '../services/api/device.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    DumbbellChartComponent,
    BasicBarChartComponent,
    StackedBarChartComponent,
    StatisticComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  totalVaccines: number = 0;
  totalDevices: number = 0;

  constructor(
    private vaccineService: VaccineService,
    private deviceService: DeviceService
  ) { }

  ngOnInit(): void {
    this.loadVaccines();
    this.loadDevices();
  }

  // Hàm để lấy tổng số vaccine
  loadVaccines(): void {
    this.vaccineService.getVaccines().subscribe({
      next: (vaccines) => {
        this.totalVaccines = vaccines.length;  // Lấy tổng số vaccine từ số lượng phần tử
        console.log('Total Vaccines:', this.totalVaccines);
      },
      error: (err) => {
        console.error('Error loading vaccines', err);
      }
    });
  }

  // Hàm để lấy tổng số thiết bị
  loadDevices(): void {
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.totalDevices = devices.length;  // Lấy tổng số thiết bị từ số lượng phần tử
        console.log('Total Devices:', this.totalDevices);
      },
      error: (err) => {
        console.error('Error loading devices', err);
      }
    });
  }
}
