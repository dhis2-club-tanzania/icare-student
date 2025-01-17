import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSamplesAllocationComponent } from './lab-samples-allocation.component';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';

describe('LabSamplesAllocationComponent', () => {
  let component: LabSamplesAllocationComponent;
  let fixture: ComponentFixture<LabSamplesAllocationComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSamplesAllocationComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSamplesAllocationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
