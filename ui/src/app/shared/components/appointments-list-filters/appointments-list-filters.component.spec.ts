import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsListFiltersComponent } from './appointments-list-filters.component';

describe('AppointmentsListFiltersComponent', () => {
  let component: AppointmentsListFiltersComponent;
  let fixture: ComponentFixture<AppointmentsListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsListFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
