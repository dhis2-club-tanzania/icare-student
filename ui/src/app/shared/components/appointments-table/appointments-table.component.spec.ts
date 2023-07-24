import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsTableComponent } from './appointments-table.component';

describe('AppointmentsTableComponent', () => {
  let component: AppointmentsTableComponent;
  let fixture: ComponentFixture<AppointmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
