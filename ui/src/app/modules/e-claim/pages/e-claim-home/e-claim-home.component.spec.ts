import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EClaimHomeComponent } from './e-claim-home.component';

describe('EClaimHomeComponent', () => {
  let component: EClaimHomeComponent;
  let fixture: ComponentFixture<EClaimHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EClaimHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EClaimHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
