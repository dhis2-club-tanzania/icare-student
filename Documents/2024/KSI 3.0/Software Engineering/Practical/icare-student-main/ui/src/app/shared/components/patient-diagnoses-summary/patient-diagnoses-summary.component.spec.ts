import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

import { PatientDiagnosesSummaryComponent } from './patient-diagnoses-summary.component';

describe('PatientDiagnosesSummaryComponent', () => {
  let component: PatientDiagnosesSummaryComponent;
  let fixture: ComponentFixture<PatientDiagnosesSummaryComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientDiagnosesSummaryComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDiagnosesSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
