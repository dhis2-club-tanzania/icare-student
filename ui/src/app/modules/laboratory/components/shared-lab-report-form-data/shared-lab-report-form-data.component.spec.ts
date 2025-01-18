import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLabReportFormDataComponent } from './shared-lab-report-form-data.component';

describe('SharedLabReportFormDataComponent', () => {
  let component: SharedLabReportFormDataComponent;
  let fixture: ComponentFixture<SharedLabReportFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLabReportFormDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLabReportFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
