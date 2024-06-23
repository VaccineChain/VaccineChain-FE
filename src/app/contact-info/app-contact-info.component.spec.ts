import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContactInfoComponent } from './app-contact-info.component';

describe('AppContactInfoComponent', () => {
  let component: AppContactInfoComponent;
  let fixture: ComponentFixture<AppContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContactInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
