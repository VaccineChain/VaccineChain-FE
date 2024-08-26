import { VaccineService } from './../services/api/vaccine.service';
import { Dose } from './../models/dose';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastService } from '../services/toast.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environment/environment';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AppApexChartLineComponent } from '../component/apexchart/line/line.component';
import { DoseService } from '../services/api/dose.service';
import { Vaccine } from '../models/vaccine';
import { handleToastErrors } from '../utils';

@Component({
  selector: 'app-manage-doses',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AppApexChartLineComponent, ReactiveFormsModule],
  templateUrl: './manage-doses.component.html',
  styleUrl: './manage-doses.component.scss'
})
export class ManageDosesComponent {
  private apiUrl = environment.apiUrl;
  doses: Dose[] = []
  popupTitle: string = '';
  doseForm!: FormGroup;
  isEditMode: boolean = false;
  vaccineIds: string[] = [];
  searchForm!: FormGroup;
  selectSearchOption: any = [
    { id: 1, name: 'Dose Number' },
  ];
  searchValue: string = '';
  currentSearchUrl: string | null = null;
  showClearButton = false;

  constructor(
    private doseService: DoseService,
    private vaccineService: VaccineService,
    private showToast: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.loadDoses();
    this.initForm();
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = new FormGroup({
      searchType: new FormControl(1, Validators.required),
      searchKeyword: new FormControl('', Validators.required)
    });
  }

  get searchType() {
    return this.searchForm.get('searchType') as FormControl;
  }
  get searchKeyword() {
    return this.searchForm.get('searchKeyword') as FormControl
  }

  initForm() {
    this.doseForm = new FormGroup({
      doseNumber: new FormControl('', Validators.required),
      dateAdministered: new FormControl('', Validators.required),
      locationAdministered: new FormControl('', Validators.required),
      ddministrator: new FormControl('', Validators.required),
      vaccineId: new FormControl('', Validators.required),
    });
  }

  get doseNumber() {
    return this.doseForm.get('doseNumber') as FormControl;
  }

  get dateAdministered() {
    return this.doseForm.get('dateAdministered') as FormControl;
  }

  get locationAdministered() {
    return this.doseForm.get('locationAdministered') as FormControl;
  }

  get administrator() {
    return this.doseForm.get('administrator') as FormControl;
  }

  get vaccineId() {
    return this.doseForm.get('vaccineId') as FormControl;
  }

  loadDoses() {
    this.doseService.getDoses().subscribe({
      next: (response: Dose[]) => {
        console.log(response);
        this.doses = response;
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      },
    });

    // Load the vaccine ids
    this.vaccineService.getVaccines().subscribe({
      next: (response: Vaccine[]) => {
        console.log(response);
        this.vaccineIds = response.map(vaccine => vaccine.VaccineId);
        console.log(this.vaccineIds);
      },
      error: (response: any) => {
        this.showToast.showErrorMessage(
          'Error',
          response.error?.message ||
          'Something went wrong. Please try again later'
        );
      }
    });
  }

  openAddDosesModal() {
    this.isEditMode = false;
    this.popupTitle = 'Add Dose';
    this.doseForm.reset();
    this.doseForm.controls['doseId'].enable();
  }

  openEditDoseModal(dose: Dose) {
    this.isEditMode = true;
    this.popupTitle = 'Edit Dose';
    this.doseForm.setValue({
      doseNumber: dose.DoseNumber,
      dateAdministered: dose.DateAdministered,
      locationAdministered: dose.LocationAdministered,
      administrator: dose.Administrator,
      vaccineId: dose.VaccineId,
    });
    console.log(this.doseForm);
    this.doseForm.controls['doseId'].disable();
  }

  submit(): void {
    if (this.doseForm.invalid) {
      this.showToast.showWarningMessage(
        'Warning',
        'Please complete all fields'
      );
      return;
    }

    const DoseData = this.doseForm.getRawValue();

    if (this.isEditMode) {
      // Call the update dose service method
      this.doseService.updateDoses(DoseData).subscribe(() => {
        this.loadDoses();
      });
    } else {
      // Call the add dose service method
      this.doseService.createDose(DoseData).subscribe(() => {
        this.loadDoses();
      });
    }

    this.doseForm.reset();
  }

  deleteDose(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete dose ${id}? This process cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doseService.deleteDose(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The dose has been deleted.',
              'success'
            );
            this.loadDoses(); // Refresh the dose list
          },
          error: (error: any) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the dose.',
              'error'
            );
            console.error(error);
          }
        });
      }
    });
  }

  onSearch() {
    var type = this.searchForm.value.searchType;
    var value = this.searchForm.value.searchKeyword;

    if(value == '') {
      const message = type == '1' ? 'Please enter a vaccine ID' : 'Please enter a vaccine name';
      this.showToast.showWarningMessage('Warning', message);
      return;
    }
    this.searchValue = value;

    if (type == '1') {
      this.searchByDoseId(value);
    }
  }

  searchByDoseId(doseId : number) {
    this.doseService.getDoseById(doseId).subscribe({
      next: (response) => {
        this.doses = [response];
        this.currentSearchUrl = `Search Dose Id: ${doseId}`;
      },
      error: (response: any) => {
        handleToastErrors(this.showToast, response);
      },
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showClearButton = input.value.length > 0;
  }

  clearSearch() {
    this.searchForm.get('searchKeyword')?.reset(); // Xóa giá trị trong ô input
    this.showClearButton = false; // Ẩn nút xóa
    this.currentSearchUrl = null;
  }

}
