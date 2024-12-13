import { StatisticLogService } from './../../../services/api/statistic-log.service';
import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Định nghĩa kiểu dữ liệu Vaccine
interface VaccineData {
  vaccineId: string;
  vaccine: string;
  vaccineName: string;
  numberOfDevice: number;
  status: string;
}

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass],
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
  // Danh sách vaccine
  vaccines: VaccineData[] = [];

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
      next: (response: any) => {
        console.log('Vaccine Device Status:', response);
        this.vaccines = this.processData(response);
        console.log('Processed Vaccines:', this.vaccines);
      },
      error: (response: any) => {
        console.error('Error loading vaccine device status', response);
      },
    });
  }

  // Xử lý dữ liệu nhóm từ API
  private processData(response: any[]): VaccineData[] {
    const groupedData = response.reduce((acc: any, item: any) => {
      const vaccineId = item.Vaccine.VaccineId;

      if (!acc[vaccineId]) {
        acc[vaccineId] = {
          vaccineId: vaccineId,
          vaccine: vaccineId,
          vaccineName: item.Vaccine.VaccineName,
          numberOfDevice: 0,
          status: item.Status,
        };
      }

      // Tăng số lượng thiết bị
      if (!acc[vaccineId].devices) {
        acc[vaccineId].devices = new Set();
      }
      acc[vaccineId].devices.add(item.Device.DeviceId);
      acc[vaccineId].numberOfDevice = acc[vaccineId].devices.size;

      return acc;
    }, {});

    // Chuyển đối tượng thành mảng
    return Object.values(groupedData).map((vaccine: any) => ({
      vaccineId: vaccine.vaccineId,
      vaccine: vaccine.vaccine,
      vaccineName: vaccine.vaccineName,
      numberOfDevice: vaccine.numberOfDevice,
      status: vaccine.status,
    }));
  }

  // Lấy danh sách vaccine đã được lọc theo từ khóa tìm kiếm
  get filteredVaccines(): VaccineData[] {
    const term = this.searchTerm.toLowerCase();
    return this.vaccines.filter(vaccine =>
      Object.values(vaccine).some(value => value.toString().toLowerCase().includes(term))
    );
  }

  // Lấy danh sách vaccine cho trang hiện tại
  get paginatedVaccines(): VaccineData[] {
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
      case 'Collected':
        return 'status-collected'; // Xanh lá
      default:
        return '';
    }
  }
}
