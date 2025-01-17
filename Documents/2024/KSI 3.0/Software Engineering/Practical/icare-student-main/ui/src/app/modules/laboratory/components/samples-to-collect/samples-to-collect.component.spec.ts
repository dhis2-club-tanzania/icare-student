import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesToCollectComponent } from './samples-to-collect.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';

describe('SamplesToCollectComponent', () => {
  let component: SamplesToCollectComponent;
  let fixture: ComponentFixture<SamplesToCollectComponent>;

  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamplesToCollectComponent],
      providers: [
        provideMockStore({
          initialState: null
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesToCollectComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
