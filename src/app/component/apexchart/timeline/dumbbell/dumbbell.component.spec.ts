import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DumbbellComponent } from './dumbbell.component';

describe('DumbbellComponent', () => {
  let component: DumbbellComponent;
  let fixture: ComponentFixture<DumbbellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DumbbellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DumbbellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
