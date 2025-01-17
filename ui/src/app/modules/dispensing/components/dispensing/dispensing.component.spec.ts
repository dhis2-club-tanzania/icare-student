/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { DrugOrdersService } from 'src/app/shared/resources/order/services';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { DispensingComponent } from './dispensing.component';

describe('DispensingComponent', () => {
  let component: DispensingComponent;
  let fixture: ComponentFixture<DispensingComponent>;

  let store: MockStore<AppState>;

  class VisitServiceMock {
    getActiveVisitDetails(): Promise<any> {
      return of(null).toPromise();
    }
  }

  class DrugOrderMock {
    getAllDrugs(): Promise<any> {
      return of(null).toPromise();
    }

    getSetMembersAsOptions(): Promise<any> {
      return of(null).toPromise();
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DispensingComponent],
      providers: [
        { provide: VisitsService, useClass: VisitServiceMock },
        { provide: DrugOrdersService, useClass: DrugOrderMock },
        provideMockStore(storeDataMock),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
