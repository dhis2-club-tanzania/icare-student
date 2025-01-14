import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleRegistrationViaBatchComponent } from './shared-sample-registration-via-batch.component';

describe('SharedSampleRegistrationViaBatchComponent', () => {
  let component: SharedSampleRegistrationViaBatchComponent;
  let fixture: ComponentFixture<SharedSampleRegistrationViaBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleRegistrationViaBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleRegistrationViaBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
