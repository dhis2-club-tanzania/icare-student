import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesToExportComponent } from './samples-to-export.component';

describe('SamplesToExportComponent', () => {
  let component: SamplesToExportComponent;
  let fixture: ComponentFixture<SamplesToExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesToExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesToExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
