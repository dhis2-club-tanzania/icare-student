import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOpenmrsRegistrationFormComponent } from './dynamic-openmrs-registration-form.component';

describe('DynamicOpenmrsRegistrationFormComponent', () => {
  let component: DynamicOpenmrsRegistrationFormComponent;
  let fixture: ComponentFixture<DynamicOpenmrsRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicOpenmrsRegistrationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicOpenmrsRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
