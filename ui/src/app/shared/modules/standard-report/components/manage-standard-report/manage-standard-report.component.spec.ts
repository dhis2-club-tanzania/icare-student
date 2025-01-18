import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStandardReportComponent } from './manage-standard-report.component';

describe('ManageStandardReportComponent', () => {
  let component: ManageStandardReportComponent;
  let fixture: ComponentFixture<ManageStandardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStandardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStandardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
