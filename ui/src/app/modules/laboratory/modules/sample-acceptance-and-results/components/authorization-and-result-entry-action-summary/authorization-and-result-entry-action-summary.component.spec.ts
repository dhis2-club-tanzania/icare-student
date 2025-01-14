import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationAndResultEntryActionSummaryComponent } from './authorization-and-result-entry-action-summary.component';

describe('AuthorizationAndResultEntryActionSummaryComponent', () => {
  let component: AuthorizationAndResultEntryActionSummaryComponent;
  let fixture: ComponentFixture<AuthorizationAndResultEntryActionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationAndResultEntryActionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationAndResultEntryActionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
