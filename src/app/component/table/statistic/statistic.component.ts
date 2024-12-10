import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass],
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
  vaccines = [
    { vaccineId: 1, vaccine: "VAC001", vaccineName: "COVID-19 Vaccine", numberOfDevice: 5, status: 'Collecting' },
    { vaccineId: 2, vaccine: "VAC002", vaccineName: "Influenza Vaccine", numberOfDevice: 1, status: 'Collected' },
    { vaccineId: 3, vaccine: "VAC003", vaccineName: "Hepatitis B Vaccine", numberOfDevice: 2, status: 'Collecting' },
    { vaccineId: 4, vaccine: "VAC004", vaccineName: "Polio Vaccine", numberOfDevice: 7, status: 'Collected' },
    { vaccineId: 5, vaccine: "VAC005", vaccineName: "Measles Vaccine", numberOfDevice: 0, status: 'Collecting' },
    { vaccineId: 6, vaccine: "VAC006", vaccineName: "Tetanus Vaccine", numberOfDevice: 4, status: 'Collected' },
    { vaccineId: 7, vaccine: "VAC007", vaccineName: "Yellow Fever Vaccine", numberOfDevice: 3, status: 'Collecting' },
    { vaccineId: 8, vaccine: "VAC008", vaccineName: "Diphtheria Vaccine", numberOfDevice: 2, status: 'Collected' },
  ];

  // Initialize searchTerm
  searchTerm: string = '';

  rowsPerPage: number = 10;
  currentPage: number = 1;

  // Get filtered vaccines based on searchTerm
  get filteredVaccines() {
    const term = this.searchTerm.toLowerCase();
    return this.vaccines.filter(vaccine =>
      Object.values(vaccine).some(value => value.toString().toLowerCase().includes(term))
    );
  }

  // Get paginated vaccines for current page and rows per page
  get paginatedVaccines() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredVaccines.slice(start, end);
  }

  // Handle search input changes
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset to first page on search change
  }

  // Handle rows per page change
  onRowsChange(event: any) {
    this.rowsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1; // Reset to first page on rows per page change
  }

  // Handle page navigation
  onPageChange(page: number) {
    this.currentPage = page;
  }

  // Method to return class based on vaccine status
  getStatusClass(status: string) {
    switch (status) {
      case 'Collecting':
        return 'status-collecting';  // Yellow color class for 'Collecting'
      case 'Collected':
        return 'status-collected';  // Green color class for 'Collected'
      default:
        return '';
    }
  }
}
