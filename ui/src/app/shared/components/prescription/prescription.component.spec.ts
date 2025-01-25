import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PrescriptionComponent } from './prescription.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import { DrugOrder } from 'src/app/shared/resources/order/models/drug-order.model';

describe('PrescriptionComponent', () => {
  let component: PrescriptionComponent;
  let fixture: ComponentFixture<PrescriptionComponent>;

  let store: MockStore<AppState>;
  let mockVisitService: jasmine.SpyObj<VisitsService>;

  beforeEach(async () => {
    mockVisitService = jasmine.createSpyObj('VisitsService', ['getActiveVisit']);
    mockVisitService.getActiveVisit.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [PrescriptionComponent],
      providers: [
        provideMockStore(storeDataMock),
        { provide: VisitsService, useValue: mockVisitService },
      ],
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

  it('should validate active dosage before ordering a drug', () => {
    spyOn(component, 'onValidateActiveDosage').and.callThrough();

    const mockDrugOrder = new DrugOrder({ id: '123', startDate: new Date(), endDate: null });

    component.onOrderingDrug(mockDrugOrder);

    expect(component.onValidateActiveDosage).toHaveBeenCalledWith(mockDrugOrder);
  });

  it('should show a warning if active dosage conflict exists', () => {
    component.activeDosageConflict = true;
    fixture.detectChanges();

    const warningElement = fixture.nativeElement.querySelector('.active-dosage-warning');
    expect(warningElement).toBeTruthy();
    expect(warningElement.textContent).toContain('A conflicting active dosage exists');
  });
});
