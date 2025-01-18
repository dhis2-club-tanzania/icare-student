import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchRegistrationComponent } from './shared-batch-registration.component';

describe('SharedBatchRegistrationComponent', () => {
  let component: SharedBatchRegistrationComponent;
  let fixture: ComponentFixture<SharedBatchRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
