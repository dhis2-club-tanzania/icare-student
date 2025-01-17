import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTechnicianModalComponent } from './allocate-technician-modal.component';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import {
  matDialogProviderMock,
  matDialogRefMock,
  matDialogDataMock
} from 'src/test-mocks/material.mocks';

describe('AllocateTechnicianModalComponent', () => {
  let component: AllocateTechnicianModalComponent;
  let fixture: ComponentFixture<AllocateTechnicianModalComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocateTechnicianModalComponent],
      providers: [
        provideMockStore(storeDataMock),
        matDialogProviderMock,
        matDialogRefMock,
        matDialogDataMock
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateTechnicianModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
