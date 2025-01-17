import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccessAndConfisSettingsModalComponent } from './report-access-and-confis-settings-modal.component';

describe('ReportAccessAndConfisSettingsModalComponent', () => {
  let component: ReportAccessAndConfisSettingsModalComponent;
  let fixture: ComponentFixture<ReportAccessAndConfisSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAccessAndConfisSettingsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccessAndConfisSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
