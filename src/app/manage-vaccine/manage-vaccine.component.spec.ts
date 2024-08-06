import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVaccineComponent } from './manage-vaccine.component';

describe('ManageVaccineComponent', () => {
  let component: ManageVaccineComponent;
  let fixture: ComponentFixture<ManageVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVaccineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
