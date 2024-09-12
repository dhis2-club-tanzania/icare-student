import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledPatientsListComponent } from './enrolled-patients-list.component';

describe('EnrolledPatientsListComponent', () => {
  let component: EnrolledPatientsListComponent;
  let fixture: ComponentFixture<EnrolledPatientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolledPatientsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolledPatientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
