/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegistrationHomeComponent } from './registration-home.component';
import { MockState, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { Mock } from 'protractor/built/driverProviders';

describe('RegistrationHomeComponent', () => {
  let component: RegistrationHomeComponent;
  let fixture: ComponentFixture<RegistrationHomeComponent>;
  let store: MockState<AppState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationHomeComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationHomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockState);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
