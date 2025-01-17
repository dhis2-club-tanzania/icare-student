import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsManagementComponent } from './programs-management.component';

describe('ProgramsManagementComponent', () => {
  let component: ProgramsManagementComponent;
  let fixture: ComponentFixture<ProgramsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
