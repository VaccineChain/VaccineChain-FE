import { AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vaccine } from '../../models/vaccine';
import { VaccineResponse } from '../../models/dto/vaccineResponse';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getVaccines() {
    return this.http.get<Vaccine[]>('/api/Vaccines');
  }

  getVaccineById(id: string) {
    return this.http.get<Vaccine>(`https://localhost:7241/api/Vaccines/GetById?vaccineId=${id}`);
  }

  getVaccineResponse(id: string) {
    const token = this.authService.getAccessToken();
    console.log('Token used for request:', token);

    const headers = {
      Authorization: `Bearer ${token}`, // Add Authorization header manually
    };

    return this.http.get<VaccineResponse[]>(`https://localhost:7241/api/Sensor/get/${id}`, { headers });
  }

  getVaccineByName(name: string) {
    return this.http.get<Vaccine[]>(`/api/Vaccines/GetByName?vaccineName=${name}`);
  }

  createVaccine(vaccine: Vaccine) {
    return this.http.post<Vaccine>('/api/Vaccines', vaccine);
  }

  updateVaccines(vaccine: Vaccine) {
    return this.http.put<Vaccine>(`/api/Vaccines/${vaccine.VaccineId}`, vaccine);
  }

  deleteVaccine(id: string) {
    return this.http.delete<Vaccine>(`/api/Vaccines/${id}`);
  }
}
