import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTestsAllocationComponent } from './sample-tests-allocation.component';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  matDialogProviderMock,
  matDialogRefMock,
  matDialogDataMock
} from 'src/test-mocks/material.mocks';
import { AppState } from 'src/app/store/reducers';

describe('SampleTestsAllocationComponent', () => {
  let component: SampleTestsAllocationComponent;
  let fixture: ComponentFixture<SampleTestsAllocationComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleTestsAllocationComponent],
      providers: [
        provideMockStore(storeDataMock),
        matDialogProviderMock,
        matDialogRefMock,
        matDialogDataMock
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTestsAllocationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
