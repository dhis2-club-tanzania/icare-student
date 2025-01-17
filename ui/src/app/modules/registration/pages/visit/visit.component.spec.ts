/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { VisitComponent } from './visit.component';
import { MockState, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import {
  matDialogProviderMock,
  matSnackBarProviderMock,
} from 'src/test-mocks/material.mocks';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { RegistrationService } from '../../services/registration.services';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('VisitComponent', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;
  let store: MockState<AppState>;

  class RegistrMock {
    getVisitTypes() {
      return of([{}]);
    }

    getServicesConceptHierarchy() {
      return of([{}]);
    }

    getPaymentOptionsHierarchy() {
      return of([{}]);
    }
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [VisitComponent],
        imports: [RouterTestingModule],
        providers: [
          provideMockStore(storeDataMock),
          matDialogProviderMock,
          matSnackBarProviderMock,
          { provide: OpenmrsHttpClientService, useValue: null },
          { provide: RegistrationService, useClass: RegistrMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockState);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
