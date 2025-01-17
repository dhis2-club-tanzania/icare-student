import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationEditComponent } from './registration-edit.component';

describe('RegistrationEditComponent', () => {
  let component: RegistrationEditComponent;
  let fixture: ComponentFixture<RegistrationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
