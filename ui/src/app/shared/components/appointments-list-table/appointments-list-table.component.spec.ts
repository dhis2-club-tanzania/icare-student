import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsListTableComponent } from './appointments-list-table.component';

describe('AppointmentsListTableComponent', () => {
  let component: AppointmentsListTableComponent;
  let fixture: ComponentFixture<AppointmentsListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
