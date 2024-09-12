import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSelectionComponent } from './program-selection.component';

describe('ProgramSelectionComponent', () => {
  let component: ProgramSelectionComponent;
  let fixture: ComponentFixture<ProgramSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
