import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsListToSendForBillingComponent } from './drugs-list-to-send-for-billing.component';

describe('DrugsListToSendForBillingComponent', () => {
  let component: DrugsListToSendForBillingComponent;
  let fixture: ComponentFixture<DrugsListToSendForBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsListToSendForBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsListToSendForBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
