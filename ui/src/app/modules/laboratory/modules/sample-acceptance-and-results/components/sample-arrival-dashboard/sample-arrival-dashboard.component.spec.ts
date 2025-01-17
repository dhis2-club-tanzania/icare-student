import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleArrivalDashboardComponent } from './sample-arrival-dashboard.component';

describe('SampleArrivalDashboardComponent', () => {
  let component: SampleArrivalDashboardComponent;
  let fixture: ComponentFixture<SampleArrivalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleArrivalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleArrivalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
