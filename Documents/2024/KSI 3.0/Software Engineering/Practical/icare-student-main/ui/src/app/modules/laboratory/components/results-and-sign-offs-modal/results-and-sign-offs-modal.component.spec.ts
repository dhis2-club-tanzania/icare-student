import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  matDialogDataMock,
  matDialogRefMock,
} from 'src/test-mocks/material.mocks';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

import { ResultsAndSignOffsModalComponent } from './results-and-sign-offs-modal.component';

describe('ResultsAndSignOffsModalComponent', () => {
  let component: ResultsAndSignOffsModalComponent;
  let fixture: ComponentFixture<ResultsAndSignOffsModalComponent>;
  let store: MockStore<AppState>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsAndSignOffsModalComponent],
      providers: [
        provideMockStore(storeDataMock),
        matDialogRefMock,
        matDialogDataMock,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsAndSignOffsModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
