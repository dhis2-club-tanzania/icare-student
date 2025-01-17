import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleResultsDashboardComponent } from './sample-results-dashboard.component';

describe('SampleTrackingDashboardComponent', () => {
  let component: SampleResultsDashboardComponent;
  let fixture: ComponentFixture<SampleResultsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleResultsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleResultsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
