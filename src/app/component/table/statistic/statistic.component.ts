import { StatisticLogService } from './../../../services/api/statistic-log.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VaccineDeviceStatus } from '../../../models/statisticAreaChart';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent {
  // Danh sách vaccine
  vaccines: VaccineDeviceStatus[] = [];

  // Biến cho tìm kiếm và phân trang
  searchTerm: string = '';
  rowsPerPage: number = 10;
  currentPage: number = 1;

  constructor(private statisticLogService: StatisticLogService) {
    this.loadData();
  }

  // Hàm tải dữ liệu từ API
  private loadData(): void {
    this.statisticLogService.GetVaccineDeviceStatus().subscribe({
      next: (response: VaccineDeviceStatus[]) => {
        this.vaccines = response;
      },
      error: (response: any) => {
        console.error('Error loading vaccine device status', response);
      },
    });
  }

  // Lấy danh sách vaccine đã được lọc theo từ khóa tìm kiếm
  get filteredVaccines(): VaccineDeviceStatus[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      return this.vaccines;
    }
    return this.vaccines.filter((vaccine) =>
      Object.values(vaccine).some((value) =>
        value.toString().toLowerCase().includes(term)
      )
    );
  }

  // Lấy danh sách vaccine cho trang hiện tại
  get paginatedVaccines(): VaccineDeviceStatus[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredVaccines.slice(start, end);
  }

  // Xử lý khi thay đổi tìm kiếm
  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset về trang đầu tiên
  }

  // Xử lý khi thay đổi số lượng hàng mỗi trang
  onRowsChange(event: any): void {
    this.rowsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1; // Reset về trang đầu tiên
  }

  // Chuyển đổi trang
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // Trả về class CSS dựa trên trạng thái
  getStatusClass(status: string): string {
    switch (status) {
      case 'Collecting':
        return 'status-collecting'; // Vàng
      case 'Completed':
        return 'status-collected'; // Xanh lá
      default:
        return '';
    }
  }
}
