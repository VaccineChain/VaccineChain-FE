import { Component } from '@angular/core';
import { AppApexChartColumnComponent } from '../component/apexchart/column/column.component';
import { RouterLink } from '@angular/router';
import { DumbbellChartComponent } from '../component/apexchart/timeline/dumbbell/dumbbell.component';
import { BasicBarChartComponent } from '../component/apexchart/bar/basic/basic.component';
import { StackedBarChartComponent } from '../component/apexchart/bar/stacked/stacked.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    DumbbellChartComponent,
    BasicBarChartComponent,
    StackedBarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
