import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleRegistrationHomeComponent } from './sample-registration-home.component';

describe('SampleRegistrationHomeComponent', () => {
  let component: SampleRegistrationHomeComponent;
  let fixture: ComponentFixture<SampleRegistrationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleRegistrationHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleRegistrationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
