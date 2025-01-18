import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSummaryCardsComponent } from './registration-summary-cards.component';

describe('RegistrationSummaryCardsComponent', () => {
  let component: RegistrationSummaryCardsComponent;
  let fixture: ComponentFixture<RegistrationSummaryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationSummaryCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSummaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
