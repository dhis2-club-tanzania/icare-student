import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabClinicalNotesSummaryComponent } from './lab-clinical-notes-summary.component';

describe('LabClinicalNotesSummaryComponent', () => {
  let component: LabClinicalNotesSummaryComponent;
  let fixture: ComponentFixture<LabClinicalNotesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabClinicalNotesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabClinicalNotesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
