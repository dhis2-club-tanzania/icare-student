import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultsComponent } from './lab-results.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { AppState } from 'src/app/store/reducers';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('LabResultsComponent', () => {
  let component: LabResultsComponent;
  let fixture: ComponentFixture<LabResultsComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResultsComponent],
      providers: [provideMockStore(storeDataMock), matDialogProviderMock],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResultsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
