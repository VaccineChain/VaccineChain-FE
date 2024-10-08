import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vaccine } from '../../models/vaccine';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient) { }

  getVaccines() {
    return this.http.get<Vaccine[]>('/api/Vaccines');
  }

  getVaccineById(id: string) {
    return this.http.get<Vaccine>(`https://localhost:7241/api/Vaccines/GetById?vaccineId=${id}`);
  }

  getVaccineByName(name: string) {
    return this.http.get<Vaccine[]>(`https://localhost:7241/api/Vaccines/GetByName?vaccineName=${name}`);
  }

  createVaccine(vaccine: Vaccine) {
    return this.http.post<Vaccine>('/api/Vaccines', vaccine);
  }

  updateVaccines(vaccine: Vaccine) {
    return this.http.put<Vaccine>(`/api/Vaccines/${vaccine.VaccineId}`, vaccine);
  }

  deleteVaccine(id: string) {
    return this.http.delete<Vaccine>(`https://localhost:7241/api/Vaccines/${id}`);
  }
}
