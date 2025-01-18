import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportModalComponent } from './manage-report-modal.component';

describe('ManageReportModalComponent', () => {
  let component: ManageReportModalComponent;
  let fixture: ComponentFixture<ManageReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
