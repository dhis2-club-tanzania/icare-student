import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCustomReportComponent } from './shared-custom-report.component';

describe('SharedCustomReportComponent', () => {
  let component: SharedCustomReportComponent;
  let fixture: ComponentFixture<SharedCustomReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCustomReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
