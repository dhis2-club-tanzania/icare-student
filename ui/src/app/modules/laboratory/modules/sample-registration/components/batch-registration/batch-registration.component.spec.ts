import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchRegistrationComponent } from './batch-registration.component';

describe('BatchRegistrationComponent', () => {
  let component: BatchRegistrationComponent;
  let fixture: ComponentFixture<BatchRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
