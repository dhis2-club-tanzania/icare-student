import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyDashboardHomeComponent } from './pharmacy-dashboard-home.component';

describe('PharmacyDashboardHomeComponent', () => {
  let component: PharmacyDashboardHomeComponent;
  let fixture: ComponentFixture<PharmacyDashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyDashboardHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
