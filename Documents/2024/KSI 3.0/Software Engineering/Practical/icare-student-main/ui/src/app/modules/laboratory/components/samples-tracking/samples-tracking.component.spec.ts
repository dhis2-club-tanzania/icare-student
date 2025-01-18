import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesTrackingComponent } from './samples-tracking.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { matDialogProviderMock } from 'src/test-mocks/material.mocks';

describe('SamplesTrackingComponent', () => {
  let component: SamplesTrackingComponent;
  let fixture: ComponentFixture<SamplesTrackingComponent>;

  let store: MockStore<AppState>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamplesTrackingComponent],
      providers: [provideMockStore(storeDataMock), matDialogProviderMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesTrackingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
