import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySampleCollectionComponent } from './laboratory-sample-collection.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('LaboratorySampleCollectionComponent', () => {
  let component: LaboratorySampleCollectionComponent;
  let fixture: ComponentFixture<LaboratorySampleCollectionComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratorySampleCollectionComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratorySampleCollectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
