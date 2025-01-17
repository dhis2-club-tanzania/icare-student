import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSamplesVerificationIntegratedComponent } from './shared-samples-verification-integrated.component';

describe('SharedSamplesVerificationIntegratedComponent', () => {
  let component: SharedSamplesVerificationIntegratedComponent;
  let fixture: ComponentFixture<SharedSamplesVerificationIntegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSamplesVerificationIntegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSamplesVerificationIntegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
