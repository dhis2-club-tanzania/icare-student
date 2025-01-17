/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  matDialogDataMock,
  matDialogRefMock,
} from 'src/test-mocks/material.mocks';
import { BillConfirmationComponent } from './bill-confirmation.component';

describe('BillConfirmationComponent', () => {
  let component: BillConfirmationComponent;
  let fixture: ComponentFixture<BillConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BillConfirmationComponent],
      providers: [matDialogRefMock, matDialogDataMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
