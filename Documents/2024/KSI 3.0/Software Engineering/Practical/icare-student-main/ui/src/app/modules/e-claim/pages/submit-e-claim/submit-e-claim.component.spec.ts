import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEClaimComponent } from './submit-e-claim.component';

describe('SubmitEClaimComponent', () => {
  let component: SubmitEClaimComponent;
  let fixture: ComponentFixture<SubmitEClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitEClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitEClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
