import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultDisplayComponent } from './lab-result-display.component';

describe('LabResultDisplayComponent', () => {
  let component: LabResultDisplayComponent;
  let fixture: ComponentFixture<LabResultDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabResultDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResultDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
