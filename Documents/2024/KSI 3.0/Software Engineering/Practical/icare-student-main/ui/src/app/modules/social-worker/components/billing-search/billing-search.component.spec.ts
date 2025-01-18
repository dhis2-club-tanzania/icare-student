import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSearchComponent } from './billing-search.component';
import { materialModules } from 'src/app/shared/material-modules';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BillingSearchComponent', () => {
  let component: BillingSearchComponent;
  let fixture: ComponentFixture<BillingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...materialModules, BrowserAnimationsModule],
      declarations: [BillingSearchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
