import { AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vaccine } from '../../models/vaccine';
import { VaccineResponse } from '../../models/dto/vaccineResponse';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getVaccines() {
    return this.http.get<Vaccine[]>('/api/Vaccines');
  }

  getVaccineById(id: string) {
    return this.http.get<Vaccine>(`/api/Vaccines/GetById?vaccineId=${id}`);
  }

  getVaccineResponse(id: string) {
    return this.http.get<VaccineResponse[]>(`https://localhost:7241/api/Sensor/get/${id}`);
  }

  getVaccineByName(name: string) {
    return this.http.get<Vaccine[]>(
      `/api/Vaccines/GetByName?vaccineName=${name}`
    );
  }

  createVaccine(vaccine: Vaccine) {
    return this.http.post<Vaccine>('/api/Vaccines', vaccine);
  }

  updateVaccines(vaccine: Vaccine) {
    return this.http.put<Vaccine>(
      `/api/Vaccines/${vaccine.VaccineId}`,
      vaccine
    );
  }

  deleteVaccine(id: string) {
    return this.http.delete<Vaccine>(`/api/Vaccines/${id}`);
  }
}
