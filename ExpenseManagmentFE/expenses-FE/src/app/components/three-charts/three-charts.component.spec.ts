import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeChartsComponent } from './three-charts.component';

describe('ThreeChartsComponent', () => {
  let component: ThreeChartsComponent;
  let fixture: ComponentFixture<ThreeChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreeChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
