import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInstrumentSelectionComponent } from './shared-instrument-selection.component';

describe('SharedInstrumentSelectionComponent', () => {
  let component: SharedInstrumentSelectionComponent;
  let fixture: ComponentFixture<SharedInstrumentSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedInstrumentSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInstrumentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
