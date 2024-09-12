import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleImportExportComponent } from './sample-import-export.component';

describe('SampleImportExportComponent', () => {
  let component: SampleImportExportComponent;
  let fixture: ComponentFixture<SampleImportExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleImportExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
