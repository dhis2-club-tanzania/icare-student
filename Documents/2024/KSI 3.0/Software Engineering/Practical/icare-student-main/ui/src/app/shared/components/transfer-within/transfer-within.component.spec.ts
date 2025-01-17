import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import {
  matDialogDataMock,
  matDialogRefMock,
} from 'src/test-mocks/material.mocks';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

import { TransferWithinComponent } from './transfer-within.component';

describe('TransferWithinComponent', () => {
  let component: TransferWithinComponent;
  let fixture: ComponentFixture<TransferWithinComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferWithinComponent],
      providers: [
        provideMockStore(storeDataMock),
        matDialogRefMock,
        matDialogDataMock,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferWithinComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
