import { Component } from '@angular/core';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [AppApexChartLineComponent],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss'
})
export class SearchResultComponent {

}
