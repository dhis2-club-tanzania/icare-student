import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOffComponent } from './sign-off.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { AppState } from 'src/app/store/reducers';

describe('SignOffComponent', () => {
  let component: SignOffComponent;
  let fixture: ComponentFixture<SignOffComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignOffComponent],
      providers: [provideMockStore(storeDataMock)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOffComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
