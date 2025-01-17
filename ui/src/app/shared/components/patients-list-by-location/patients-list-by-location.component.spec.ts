import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsListByLocationComponent } from './patients-list-by-location.component';

describe('PatientsListByLocationComponent', () => {
  let component: PatientsListByLocationComponent;
  let fixture: ComponentFixture<PatientsListByLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsListByLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsListByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
