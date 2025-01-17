import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitClaimComponent } from './visit-claim.component';

describe('VisitClaimComponent', () => {
  let component: VisitClaimComponent;
  let fixture: ComponentFixture<VisitClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
