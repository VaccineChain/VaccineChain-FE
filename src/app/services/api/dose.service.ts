import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dose } from '../../models/dose';

@Injectable({
  providedIn: 'root'
})
export class DoseService {
  constructor(private http: HttpClient) { }

  getDoses() {
    return this.http.get<Dose[]>('/api/Doses');
  }

  getDoseById(id: number) {
    return this.http.get<Dose>(`/api/Doses/GetById?doseId=${id}`);
  }

  createDose(dose: Dose) {
    return this.http.post<Dose>('/api/Doses', dose);
  }

  updateDoses(dose: Dose) {
    return this.http.put<Dose>(`/api/Doses/${dose.DoseNumber}`, dose);
  }

  deleteDose(id: number) {
    return this.http.delete<any>(`/api/Doses/${id}`);
  }
}
