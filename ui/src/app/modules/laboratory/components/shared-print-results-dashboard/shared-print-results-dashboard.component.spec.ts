import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPrintResultsDashboardComponent } from './shared-print-results-dashboard.component';

describe('SharedPrintResultsDashboardComponent', () => {
  let component: SharedPrintResultsDashboardComponent;
  let fixture: ComponentFixture<SharedPrintResultsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPrintResultsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPrintResultsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
