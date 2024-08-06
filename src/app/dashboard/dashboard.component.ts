import { Component } from '@angular/core';
import { AppApexChartColumnComponent } from '../component/apexchart/column/column.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppApexChartColumnComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
