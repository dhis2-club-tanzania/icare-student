import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { AppState } from 'src/app/store/reducers';
import { HttpClientServiceMock } from 'src/test-mocks/http-client.mock';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

import { NursingHomeComponent } from './nursing-home.component';

describe('TriageHomeComponent', () => {
  let component: NursingHomeComponent;
  let fixture: ComponentFixture<NursingHomeComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NursingHomeComponent],
      providers: [
        provideMockStore(storeDataMock),
        {
          provide: OpenmrsHttpClientService,
          useClass: HttpClientServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingHomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
