import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRegistrationComponent } from './single-registration.component';

describe('SingleRegistrationComponent', () => {
  let component: SingleRegistrationComponent;
  let fixture: ComponentFixture<SingleRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
