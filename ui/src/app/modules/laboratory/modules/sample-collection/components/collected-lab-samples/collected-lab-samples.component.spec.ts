import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedLabSamplesComponent } from './collected-lab-samples.component';
import { AppState } from 'src/app/store/reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('CollectedLabSamplesComponent', () => {
  let component: CollectedLabSamplesComponent;
  let fixture: ComponentFixture<CollectedLabSamplesComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectedLabSamplesComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectedLabSamplesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
