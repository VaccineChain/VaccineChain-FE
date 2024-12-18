import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedComponent } from './stacked.component';

describe('StackedComponent', () => {
  let component: StackedComponent;
  let fixture: ComponentFixture<StackedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
