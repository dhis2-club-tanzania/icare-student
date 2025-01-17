import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrderComponent } from './drug-order.component';
import { DrugOrdersService } from '../../resources/order/services';
import { of } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('DrugOrderComponent', () => {
  let component: DrugOrderComponent;
  let fixture: ComponentFixture<DrugOrderComponent>;
  let store: MockStore<AppState>;

  class drugOrderMock {
    getSetMembersAsOptions() {
      return of(null).toPromise();
    }

    getDrugOrdersFrequency() {
      return of(null).toPromise();
    }

    getConceptAnswersAsOptions() {
      return of(null).toPromise();
    }

    getAllDrugs() {
      return of(null).toPromise();
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugOrderComponent],
      providers: [
        { provide: DrugOrdersService, useClass: drugOrderMock },
        provideMockStore({
          initialState: null,
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
