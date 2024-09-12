import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLabReportHeaderComponent } from './shared-lab-report-header.component';

describe('SharedLabReportHeaderComponent', () => {
  let component: SharedLabReportHeaderComponent;
  let fixture: ComponentFixture<SharedLabReportHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLabReportHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLabReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
