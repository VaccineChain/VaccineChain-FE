import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLogComponent } from './manage-log.component';

describe('ManageLogComponent', () => {
  let component: ManageLogComponent;
  let fixture: ComponentFixture<ManageLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
