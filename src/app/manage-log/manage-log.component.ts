import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { environment } from '../../environment/environment';
import { ToastService } from '../services/toast.service';
import { LogService } from '../services/api/log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Log } from '../models/log';
import { Vaccine } from '../models/vaccine';

@Component({
  selector: 'app-manage-log',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, AppApexChartLineComponent],
  templateUrl: './manage-log.component.html',
  styleUrl: './manage-log.component.scss'
})
export class ManageLogComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  logs: Log[] = [];
  connected: Log[] = [];

  constructor(
    private logService: LogService,
    private showToast: ToastService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadVaccines();
  }

  loadVaccines() {
    this.logService.getLogs().subscribe({
      next: (response: Log[]) => {
        console.log(response);
        this.connected = response;
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });
  }

  viewLogs(vaccine: Vaccine) {
    console.log(vaccine);
    this.logs = new Array<Log>();
  }

}

