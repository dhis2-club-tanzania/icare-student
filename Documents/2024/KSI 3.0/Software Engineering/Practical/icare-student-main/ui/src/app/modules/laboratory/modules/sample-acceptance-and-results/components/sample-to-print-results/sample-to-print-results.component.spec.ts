import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleToPrintResultsComponent } from './sample-to-print-results.component';

describe('SampleToPrintResultsComponent', () => {
  let component: SampleToPrintResultsComponent;
  let fixture: ComponentFixture<SampleToPrintResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleToPrintResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleToPrintResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
