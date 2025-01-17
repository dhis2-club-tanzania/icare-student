import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesSelectionComponent } from './codes-selection.component';

describe('CodesSelectionComponent', () => {
  let component: CodesSelectionComponent;
  let fixture: ComponentFixture<CodesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodesSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
