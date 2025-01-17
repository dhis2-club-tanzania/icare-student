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
  getCreatingLabOrderState,
  getFailedLabOrders,
  getAllOrderTypes,
  getOrderTypesByName,
  getAllNewLabOrders,
} from 'src/app/store/selectors';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import { LabOrder } from 'src/app/shared/resources/visits/models/lab-order.model';
import { combineFormMembersWithBillableItemsDetails } from 'src/app/shared/resources/billable-items/helpers/combine-form-members-with-billable-items-details.helper';
import { ProcedureOrder } from '../../resources/visits/models/procedure-order.model';
import { RadiologyOrder } from '../../resources/visits/models/radiology-order.model';

@Component({
  selector: 'app-investigation-procedure',
  templateUrl: './investigation-procedure.component.html',
  styleUrls: ['./investigation-procedure.component.scss'],
})
export class InvestigationProcedureComponent implements OnInit {
  @Input() investigationAndProceduresFormsDetails: ICAREForm;
  @Input() visit: VisitObject;
  @Input() billableItems: any;
  @Input() patient: any;
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
  procedureOrders$: Observable<ProcedureOrder[]>;
  radiologyOrders$: Observable<RadiologyOrder[]>;
  failedOrders = {};
  failedOrders$: Observable<any>;
  voidingLabOrder$: Observable<boolean>;
  orderTypes$: Observable<OrdertypeGet[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.departments =
      this.investigationAndProceduresFormsDetails?.setMembers || [];
    this.currentDepartmentGroup = (this.departments || [])[0];
    this.currentForm = ((this.departments || [])[0]?.setMembers || [])[0];

    this.currentForm = {
      ...this.currentForm,
      formFields: combineFormMembersWithBillableItemsDetails(
        this.currentForm?.setMembers,
        this.billableItems
      ),
      setMembers: combineFormMembersWithBillableItemsDetails(
        this.currentForm?.setMembers,
        this.billableItems
      ),
    };

    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: 'Test Order',
    });

    this.orderTypes$ = this.store.select(getAllOrderTypes);

    this.provider$ = this.store.select(getProviderDetails);

    this.labOrders$ = this.store.select(getAllNewLabOrders);
    this.failedOrders$ = this.store.select(getFailedLabOrders);
  }

  setCurrentDepartmentGroup(event: Event, departmentGroup) {
    event.stopPropagation();
    this.currentDepartmentGroup = departmentGroup;
  }

  onGetFormValue(orderData, patient): void {
    if (orderData?.hasValue) {
      this.orderedItems = [...this.orderedItems, orderData];
      this.order = {
        concept: orderData?.value,
        orderType: orderData.orderType,
        action: 'NEW',
        patient: patient.uuid,
        careSetting: !this.visit?.isAdmitted ? 'OUTPATIENT' : 'INPATIENT',
        orderer: orderData.orderer,
        urgency: 'ROUTINE',
        encounter:
          this.visit && this.visit?.encounterUuid
            ? this.visit?.encounterUuid
            : JSON.parse(localStorage.getItem('patientConsultation'))[
                'encounterUuid'
              ],
        type: orderData?.type,
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
    this.currentForm = {
      ...this.currentForm,
      formFields: combineFormMembersWithBillableItemsDetails(
        this.currentForm?.setMembers,
        this.billableItems
      ),
      setMembers: combineFormMembersWithBillableItemsDetails(
        this.currentForm?.setMembers,
        this.billableItems
      ),
    };
  }

  onSaveOrders(e, patient): void {
    e.stopPropagation();
    this.store.dispatch(
      createLabOrders({
        orders: this.orders,
        patientId: patient?.uuid,
      })
    );
    this.orders = [];
    this.orderedItems = [];
    this.creatingLabOrderState$ = this.store.select(getCreatingLabOrderState);
    this.failedOrders$ = this.store.select(getFailedLabOrders);
  }

  onDeleteOrder(e, order, orderType, provider, voidingLabOrder) {
    e.stopPropagation();
    const orderToDiscontinue = {
      type: 'testorder',
      action: 'DISCONTINUE',
      previousOrder: order?.uuid,
      careSetting: 'OUTPATIENT',
      patient: order?.patientUuid,
      concept: order?.concept?.uuid,
      encounter:
        this.visit && this.visit?.encounterUuid
          ? this.visit?.encounterUuid
          : JSON.parse(localStorage.getItem('patientConsultation'))[
              'encounterUuid'
            ],
      orderType: orderType?.uuid,
      orderer: provider?.uuid,
    };
    if (!voidingLabOrder) {
      this.store.dispatch(voidOrder({ order: orderToDiscontinue }));
    }
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
