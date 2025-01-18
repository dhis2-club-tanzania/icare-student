import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetOccupancySummaryModalComponent } from './cabinet-occupancy-summary-modal.component';

describe('CabinetOccupancySummaryModalComponent', () => {
  let component: CabinetOccupancySummaryModalComponent;
  let fixture: ComponentFixture<CabinetOccupancySummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabinetOccupancySummaryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetOccupancySummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
