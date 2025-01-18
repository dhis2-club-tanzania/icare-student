import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSamplesStatusesComponent } from './lab-samples-statuses.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('LabSamplesStatusesComponent', () => {
  let component: LabSamplesStatusesComponent;
  let fixture: ComponentFixture<LabSamplesStatusesComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSamplesStatusesComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSamplesStatusesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
