import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesRejectedAfterRegistrationComponent } from './samples-rejected-after-registration.component';

describe('SamplesRejectedAfterRegistrationComponent', () => {
  let component: SamplesRejectedAfterRegistrationComponent;
  let fixture: ComponentFixture<SamplesRejectedAfterRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesRejectedAfterRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesRejectedAfterRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
