/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExemptionConfirmationComponent } from './exemption-confirmation.component';
import { matDialogRefMock } from 'src/test-mocks/material.mocks';

describe('ExemptionConfirmationComponent', () => {
  let component: ExemptionConfirmationComponent;
  let fixture: ComponentFixture<ExemptionConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExemptionConfirmationComponent],
      providers: [matDialogRefMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
