import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalDataComponent } from './clinical-data.component';

describe('ClinicalDataComponent', () => {
  let component: ClinicalDataComponent;
  let fixture: ComponentFixture<ClinicalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
