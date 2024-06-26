import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStatsComponent } from './app-stats.component';

describe('AppStatsComponent', () => {
  let component: AppStatsComponent;
  let fixture: ComponentFixture<AppStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
