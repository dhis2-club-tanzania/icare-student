import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsSectionManagementComponent } from './labs-section-management.component';

describe('LabsSectionManagementComponent', () => {
  let component: LabsSectionManagementComponent;
  let fixture: ComponentFixture<LabsSectionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabsSectionManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsSectionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
