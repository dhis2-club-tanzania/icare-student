import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDrugDosageInterpretationComponent } from './shared-drug-dosage-interpretation.component';

describe('SharedDrugDosageInterpretationComponent', () => {
  let component: SharedDrugDosageInterpretationComponent;
  let fixture: ComponentFixture<SharedDrugDosageInterpretationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDrugDosageInterpretationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDrugDosageInterpretationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
