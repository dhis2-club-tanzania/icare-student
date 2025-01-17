import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEntryByWorksheetComponent } from './result-entry-by-worksheet.component';

describe('ResultEntryByWorksheetComponent', () => {
  let component: ResultEntryByWorksheetComponent;
  let fixture: ComponentFixture<ResultEntryByWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultEntryByWorksheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEntryByWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
