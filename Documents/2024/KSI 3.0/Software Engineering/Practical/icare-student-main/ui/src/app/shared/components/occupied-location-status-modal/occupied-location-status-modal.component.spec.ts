import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupiedLocationStatusModalComponent } from './occupied-location-status-modal.component';

describe('OccupiedLocationStatusModalComponent', () => {
  let component: OccupiedLocationStatusModalComponent;
  let fixture: ComponentFixture<OccupiedLocationStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccupiedLocationStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupiedLocationStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
