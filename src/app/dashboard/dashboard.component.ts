import { Component } from '@angular/core';
import { AppApexChartColumnComponent } from '../component/apexchart/column/column.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AppApexChartColumnComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
