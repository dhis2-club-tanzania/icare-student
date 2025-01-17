import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionComponent } from './prescription.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('PrescriptionComponent', () => {
  let component: PrescriptionComponent;
  let fixture: ComponentFixture<PrescriptionComponent>;

  let store: MockStore<AppState>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
