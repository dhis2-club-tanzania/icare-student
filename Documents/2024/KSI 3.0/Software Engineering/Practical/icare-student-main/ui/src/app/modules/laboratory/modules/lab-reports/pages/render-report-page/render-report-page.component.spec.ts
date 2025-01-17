import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderReportPageComponent } from './render-report-page.component';

describe('RenderReportPageComponent', () => {
  let component: RenderReportPageComponent;
  let fixture: ComponentFixture<RenderReportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderReportPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
