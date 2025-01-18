import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEntryByWorksheetHomeComponent } from './result-entry-by-worksheet-home.component';

describe('ResultEntryByWorksheetHomeComponent', () => {
  let component: ResultEntryByWorksheetHomeComponent;
  let fixture: ComponentFixture<ResultEntryByWorksheetHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultEntryByWorksheetHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEntryByWorksheetHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
