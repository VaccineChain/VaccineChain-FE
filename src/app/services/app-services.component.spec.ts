import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppServicesComponent } from './app-services.component';

describe('AppServicesComponent', () => {
  let component: AppServicesComponent;
  let fixture: ComponentFixture<AppServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
