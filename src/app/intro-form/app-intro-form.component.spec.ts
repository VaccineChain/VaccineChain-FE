import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIntroFormComponent } from './app-intro-form.component';

describe('AppIntroFormComponent', () => {
  let component: AppIntroFormComponent;
  let fixture: ComponentFixture<AppIntroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIntroFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIntroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
