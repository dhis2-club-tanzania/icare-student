import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDiagnosesComponent } from './active-diagnoses.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('ActiveDiagnosesComponent', () => {
  let component: ActiveDiagnosesComponent;
  let fixture: ComponentFixture<ActiveDiagnosesComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveDiagnosesComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDiagnosesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
