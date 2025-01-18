import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintResultsModalComponent } from './print-results-modal.component';

describe('PrintResultsModalComponent', () => {
  let component: PrintResultsModalComponent;
  let fixture: ComponentFixture<PrintResultsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintResultsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
