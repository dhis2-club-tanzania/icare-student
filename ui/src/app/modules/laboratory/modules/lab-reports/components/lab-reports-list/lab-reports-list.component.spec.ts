import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReportsListComponent } from './lab-reports-list.component';

describe('LabReportsListComponent', () => {
  let component: LabReportsListComponent;
  let fixture: ComponentFixture<LabReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabReportsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
