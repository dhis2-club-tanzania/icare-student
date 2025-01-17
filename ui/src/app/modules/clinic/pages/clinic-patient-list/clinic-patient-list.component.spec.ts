/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClinicPatientListComponent } from './clinic-patient-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { AppState } from 'src/app/store/reducers';

describe('ClinicPatientListComponent', () => {
  let component: ClinicPatientListComponent;
  let fixture: ComponentFixture<ClinicPatientListComponent>;
  let store: MockStore<AppState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicPatientListComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicPatientListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
