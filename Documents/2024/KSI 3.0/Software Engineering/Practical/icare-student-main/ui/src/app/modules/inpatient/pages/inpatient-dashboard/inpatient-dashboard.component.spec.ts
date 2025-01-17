import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientDashboardComponent } from './inpatient-dashboard.component';

describe('InpatientDashboardComponent', () => {
  let component: InpatientDashboardComponent;
  let fixture: ComponentFixture<InpatientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpatientDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
