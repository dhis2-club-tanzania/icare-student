/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedConfirmationComponent } from './shared-confirmation.component';
import { matDialogRefMock } from 'src/test-mocks/material.mocks';

describe("SharedConfirmationComponent", () => {
  let component: SharedConfirmationComponent;
  let fixture: ComponentFixture<SharedConfirmationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SharedConfirmationComponent],
        providers: [matDialogRefMock],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
