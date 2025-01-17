import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSearchComponent } from './patient-search.component';
import { materialModules } from '../../material-modules';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenmrsHttpClientService } from '../../modules/openmrs-http-client/services/openmrs-http-client.service';
import { WithLoadingPipe } from '../../pipes/with-loading.pipe';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('PatientSearchComponent', () => {
  let component: PatientSearchComponent;
  let fixture: ComponentFixture<PatientSearchComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...materialModules, BrowserAnimationsModule],
      declarations: [PatientSearchComponent, WithLoadingPipe],
      providers: [
        { provide: OpenmrsHttpClientService, useValue: null },
        provideMockStore(storeDataMock),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
