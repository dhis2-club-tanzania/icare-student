import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisComponent } from './diagnosis.component';
import { of } from 'rxjs';
import { FormService } from 'src/app/shared/modules/form/services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { DiagnosisService } from 'src/app/shared/resources/diagnosis/services/diagnosis.service';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('DiagnosisComponent', () => {
  let component: DiagnosisComponent;
  let fixture: ComponentFixture<DiagnosisComponent>;

  let store: MockStore<AppState>;

  class FormServiceMock {
    getForm(): Promise<any> {
      return of(null).toPromise();
    }
  }

  class DiagnosiServiceMock {
    createPatientDiagnosis(): Promise<any> {
      return of(null).toPromise();
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosisComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormService, useClass: FormServiceMock },
        { provide: DiagnosisService, useClass: DiagnosiServiceMock },
        provideMockStore(storeDataMock),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
