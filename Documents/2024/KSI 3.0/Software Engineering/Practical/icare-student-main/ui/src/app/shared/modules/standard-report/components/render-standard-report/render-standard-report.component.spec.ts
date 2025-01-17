import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderStandardReportComponent } from './render-standard-report.component';

describe('RenderStandardReportComponent', () => {
  let component: RenderStandardReportComponent;
  let fixture: ComponentFixture<RenderStandardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderStandardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderStandardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
