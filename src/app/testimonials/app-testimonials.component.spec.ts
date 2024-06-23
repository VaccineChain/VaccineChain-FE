import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestimonialsComponent } from './app-testimonials.component';

describe('AppTestimonialsComponent', () => {
  let component: AppTestimonialsComponent;
  let fixture: ComponentFixture<AppTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
