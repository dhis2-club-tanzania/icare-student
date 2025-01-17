import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryInvestigationHomeComponent } from './laboratory-investigation-home.component';

describe('LaboratoryInvestigationHomeComponent', () => {
  let component: LaboratoryInvestigationHomeComponent;
  let fixture: ComponentFixture<LaboratoryInvestigationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaboratoryInvestigationHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoryInvestigationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
