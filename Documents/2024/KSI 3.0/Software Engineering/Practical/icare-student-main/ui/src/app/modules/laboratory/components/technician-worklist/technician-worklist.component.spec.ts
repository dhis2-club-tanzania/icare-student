import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianWorklistComponent } from './technician-worklist.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('TechnicianWorklistComponent', () => {
  let component: TechnicianWorklistComponent;
  let fixture: ComponentFixture<TechnicianWorklistComponent>;
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianWorklistComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianWorklistComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
