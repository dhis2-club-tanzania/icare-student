import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeBasedStandardReportComponent } from './iframe-based-standard-report.component';

describe('IframeBasedStandardReportComponent', () => {
  let component: IframeBasedStandardReportComponent;
  let fixture: ComponentFixture<IframeBasedStandardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeBasedStandardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeBasedStandardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
