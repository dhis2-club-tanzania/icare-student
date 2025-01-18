import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTrackingDashboardComponent } from './sample-tracking-dashboard.component';

describe('SampleTrackingDashboardComponent', () => {
  let component: SampleTrackingDashboardComponent;
  let fixture: ComponentFixture<SampleTrackingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTrackingDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTrackingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
