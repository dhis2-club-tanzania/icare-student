/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExemptionFullConfirmationComponent } from './exemption-full-confirmation.component';
import { matDialogRefMock } from 'src/test-mocks/material.mocks';

describe('ExemptionFullConfirmationComponent', () => {
  let component: ExemptionFullConfirmationComponent;
  let fixture: ComponentFixture<ExemptionFullConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExemptionFullConfirmationComponent],
      providers: [matDialogRefMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionFullConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
