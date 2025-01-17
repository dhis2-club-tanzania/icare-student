/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExemptionDenialComponent } from './exemption-denial.component';
import { matDialogRefMock } from 'src/test-mocks/material.mocks';

describe('ExemptionDenialComponent', () => {
  let component: ExemptionDenialComponent;
  let fixture: ComponentFixture<ExemptionDenialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExemptionDenialComponent],
      providers: [matDialogRefMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionDenialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
