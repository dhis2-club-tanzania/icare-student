/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuotationItemComponent } from './quotation-item.component';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('QuotationItemComponent', () => {
  let component: QuotationItemComponent;
  let fixture: ComponentFixture<QuotationItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationItemComponent],
      providers: [matDialogProviderMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
