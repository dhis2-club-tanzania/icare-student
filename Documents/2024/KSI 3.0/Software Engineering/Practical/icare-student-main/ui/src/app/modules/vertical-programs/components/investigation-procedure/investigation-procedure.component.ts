import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { ICAREForm } from 'src/app/shared/modules/form/models/form.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import {
  createLabOrder,
  createLabOrders,
  removeLabOrder,
  voidOrder,
} from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { Observable } from 'rxjs';
import { OrdertypeGet, ProviderGet } from 'src/app/shared/resources/openmrs';
import {
  getAllLabOrders,
  getCreatingLabOrderFailsState,
  getCreatingLabOrderState,
  getFailedLabOrders,
  getLabOrdersKeyedByConceptUuid,
  getLabOrderVoidingState,
  getOrderTypesByName,
} from 'src/app/store/selectors';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import { LabOrder } from 'src/app/shared/resources/visits/models/lab-order.model';

@Component({
  selector: 'app-investigation-procedure',
  templateUrl: './investigation-procedure.component.html',
  styleUrls: ['./investigation-procedure.component.scss'],
})
export class InvestigationProcedureComponent implements OnInit {
  @Input() investigationAndProceduresFormsDetails: ICAREForm;
  @Input() visit: VisitObject;
  @Input() patient: Patient;
  departments: ICAREForm[];
  currentForm: ICAREForm;
  currentDepartmentGroup: ICAREForm;
  order: any = {};
  orderType$: Observable<OrdertypeGet>;
  provider$: Observable<ProviderGet>;
  orders: any[] = [];
  orderedItems: any[] = [];
  creatingLabOrderState$: Observable<boolean>;
  creatingLabOrderFailsState$: Observable<boolean>;
  labOrders$: Observable<LabOrder[]>;
  failedOrders = {};
  failedOrders$: Observable<any>;
  voidingLabOrder$: Observable<boolean>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    console.log('3 ***** ');
    this.departments =
      this.investigationAndProceduresFormsDetails?.setMembers || [];
    this.currentDepartmentGroup = (this.departments || [])[0];
    this.currentForm = ((this.departments || [])[0]?.setMembers || [])[0];

    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: 'Test Order',
    });

    this.provider$ = this.store.select(getProviderDetails);

    this.labOrders$ = this.store.select(getAllLabOrders);
    this.failedOrders$ = this.store.select(getFailedLabOrders);
  }

  onGetFormValue(orderData): void {
    if (orderData?.hasValue) {
      this.orderedItems = [...this.orderedItems, orderData];
      this.order = {
        concept: orderData?.value,
        orderType: orderData.orderType,
        action: 'NEW',
        patient: this.patient.id,
        careSetting: 'OUTPATIENT',
        orderer: orderData.orderer,
        urgency: 'ROUTINE',
        encounter: this.visit?.encounterUuid,
        type: 'testorder',
      };
      this.orders = [...this.orders, this.order];
    } else {
      this.orderedItems = this.orderedItems.filter(function (orderedItem) {
        return orderedItem?.id !== orderData?.id;
      });

      this.orders = this.orders.filter(function (order) {
        return order?.concept !== orderData?.id;
      });
    }
  }

  setCurrentForm(e, form): void {
    e.stopPropagation();
    this.currentForm = form;
  }

  onSaveOrders(e): void {
    e.stopPropagation();
    this.store.dispatch(
      createLabOrders({ orders: this.orders, patientId: this.patient?.id })
    );
    this.orders = [];
    this.creatingLabOrderState$ = this.store.select(getCreatingLabOrderState);
    // this.orders.forEach((currentOrder) => {
    //   this.save(currentOrder);
    //   this.creatingLabOrderState$ = this.store.select(getCreatingLabOrderState);
    //   this.creatingLabOrderFailsState$ = this.store.select(
    //     getCreatingLabOrderFailsState
    //   );

    //   this.creatingLabOrderFailsState$.subscribe((state) => {
    //     this.orders = this.orders.filter(function (order) {
    //       order?.concept !== currentOrder?.id;
    //     });
    //   });
    // });
    this.failedOrders$ = this.store.select(getFailedLabOrders);
    // this.creatingLabOrderState$ = this.store.select(getCreatingLabOrderState);
  }

  onDeleteOrder(e, order, orderType, provider) {
    e.stopPropagation();
    const orderToDiscontinue = {
      type: 'testorder',
      action: 'DISCONTINUE',
      previousOrder: order?.uuid,
      careSetting: 'OUTPATIENT',
      patient: order?.patientUuid,
      concept: order?.concept?.uuid,
      encounter: order?.encounterUuid,
      orderType: orderType?.uuid,
      orderer: provider?.uuid,
    };
    this.store.dispatch(voidOrder({ order: orderToDiscontinue }));
    this.voidingLabOrder$ = this.store.select(getLabOrderVoidingState);
  }

  async save(currentOrder) {
    await this.store.dispatch(createLabOrder({ order: currentOrder }));
  }

  onRemoveItem(e, item) {
    e.stopPropagation();
    this.orderedItems = this.orderedItems.filter(function (orderedItem) {
      return orderedItem?.id !== item?.id;
    });

    this.orders = this.orders.filter(function (order) {
      return order?.concept !== item?.id;
    });
  }
}
