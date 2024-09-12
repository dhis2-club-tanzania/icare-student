import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRenderStandardReportComponent } from './store-render-standard-report.component';

describe('StoreRenderStandardReportComponent', () => {
  let component: StoreRenderStandardReportComponent;
  let fixture: ComponentFixture<StoreRenderStandardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreRenderStandardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRenderStandardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
