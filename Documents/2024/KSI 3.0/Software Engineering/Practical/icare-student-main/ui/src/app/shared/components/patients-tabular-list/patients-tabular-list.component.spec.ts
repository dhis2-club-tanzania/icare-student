import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsTabularListComponent } from './patients-tabular-list.component';

describe('PatientsTabularListComponent', () => {
  let component: PatientsTabularListComponent;
  let fixture: ComponentFixture<PatientsTabularListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsTabularListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsTabularListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
