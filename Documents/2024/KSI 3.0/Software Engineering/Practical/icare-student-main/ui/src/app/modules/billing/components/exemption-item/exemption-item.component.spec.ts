/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExemptionItemComponent } from './exemption-item.component';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('ExemptionItemComponent', () => {
  let component: ExemptionItemComponent;
  let fixture: ComponentFixture<ExemptionItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExemptionItemComponent],
      providers: [matDialogProviderMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
