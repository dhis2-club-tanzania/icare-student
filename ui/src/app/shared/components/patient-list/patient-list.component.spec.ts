/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PatientListComponent } from './patient-list.component';
import { OpenmrsHttpClientService } from '../../modules/openmrs-http-client/services/openmrs-http-client.service';
import { HttpClientServiceMock } from 'src/test-mocks/http-client.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PatientListComponent],
        providers: [
          provideMockStore(storeDataMock),
          {
            provide: OpenmrsHttpClientService,
            useClass: HttpClientServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
