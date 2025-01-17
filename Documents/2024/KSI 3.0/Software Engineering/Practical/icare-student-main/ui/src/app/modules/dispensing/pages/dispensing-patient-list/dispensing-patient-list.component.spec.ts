/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DispensingPatientListComponent } from './dispensing-patient-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { AppState } from 'src/app/store/reducers';

describe('DispensingPatientListComponent', () => {
  let component: DispensingPatientListComponent;
  let fixture: ComponentFixture<DispensingPatientListComponent>;
  let store: MockStore<AppState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DispensingPatientListComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensingPatientListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
