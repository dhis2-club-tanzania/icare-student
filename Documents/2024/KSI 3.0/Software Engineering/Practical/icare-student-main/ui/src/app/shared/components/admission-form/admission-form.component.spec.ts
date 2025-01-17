import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import {
  matDialogDataMock,
  matDialogRefMock,
} from 'src/test-mocks/material.mocks';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

import { AdmissionFormComponent } from './admission-form.component';

describe('AdmissionFormComponent', () => {
  let component: AdmissionFormComponent;
  let fixture: ComponentFixture<AdmissionFormComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmissionFormComponent],
      providers: [
        provideMockStore(storeDataMock),
        matDialogRefMock,
        matDialogDataMock,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
