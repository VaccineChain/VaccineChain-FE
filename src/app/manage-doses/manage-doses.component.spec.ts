import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDosesComponent } from './manage-doses.component';

describe('ManageDosesComponent', () => {
  let component: ManageDosesComponent;
  let fixture: ComponentFixture<ManageDosesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDosesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDosesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
