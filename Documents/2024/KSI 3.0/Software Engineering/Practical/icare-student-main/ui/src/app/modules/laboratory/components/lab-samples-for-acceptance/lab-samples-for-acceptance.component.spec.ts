import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSamplesForAcceptanceComponent } from './lab-samples-for-acceptance.component';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('LabSamplesForAcceptanceComponent', () => {
  let component: LabSamplesForAcceptanceComponent;
  let fixture: ComponentFixture<LabSamplesForAcceptanceComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSamplesForAcceptanceComponent],
      providers: [provideMockStore(storeDataMock), matDialogProviderMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSamplesForAcceptanceComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
