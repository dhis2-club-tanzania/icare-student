import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEClaimDashboardComponent } from './submit-e-claim-dashboard.component';

describe('SubmitEClaimDashboardComponent', () => {
  let component: SubmitEClaimDashboardComponent;
  let fixture: ComponentFixture<SubmitEClaimDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitEClaimDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitEClaimDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
