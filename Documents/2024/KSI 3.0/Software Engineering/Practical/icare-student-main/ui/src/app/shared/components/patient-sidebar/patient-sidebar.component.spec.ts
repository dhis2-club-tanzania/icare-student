/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PatientSidebarComponent } from './patient-sidebar.component';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('PatientSidebarComponent', () => {
  let component: PatientSidebarComponent;
  let fixture: ComponentFixture<PatientSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSidebarComponent],
      providers: [matDialogProviderMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
