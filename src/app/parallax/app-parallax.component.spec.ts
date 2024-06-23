import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppParallaxComponent } from './app-parallax.component';

describe('AppParallaxComponent', () => {
  let component: AppParallaxComponent;
  let fixture: ComponentFixture<AppParallaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppParallaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppParallaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
