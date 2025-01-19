import { createAction, props } from '@ngrx/store';
import { DrugOrderObject } from 'src/app/shared/resources/order/models/drug-order.model';

export const loadDrugOrders = createAction(
  '[Drug Order] load drg orders',
  props<{ uuids?: string[] }>()
);

export const loadDrugOrdersFail = createAction(
  '[Drug Order] load drug orders fail',
  props<{ error: any }>()
);

export const addDrugsOrdered = createAction(
  '[Drug orders] add drug orders',
  props<{ drugOrders: any[] }>()
);

export const removeDrugOrder = createAction(
  '[Drug orders] remove drug order',
  props<{ orderId: string }>()
);

export const updateDrugOrder = createAction(
  '[Drug orders] update drug ordered',
  props<{ drugOrder: DrugOrderObject }>()
);

export const saveDrugOrder = createAction(
  '[Drug orders] save drug order',
  props<{ drugOrder: DrugOrderObject; isDispensing?: boolean }>()
);

export const saveDrugOrderFail = createAction(
  '[Drug orders] save drug order fail',
  props<{ error: any }>()
);

export const dispenseDrug = createAction(
  '[DrugOrder] dispense drug',
  props<{ drugOrder: DrugOrderObject }>()
);

export const dispenseDrugSuccess = createAction(
  '[DrugOrder] dispense drug success',
  props<{ drugOrder: DrugOrderObject }>()
);

export const dispenseDrugFail = createAction(
  '[DrugOrder] dispense drug fail',
  props<{ drugOrder: DrugOrderObject; error?: any }>()
);

export const deleteDrugOrder = createAction(
  '[Drug orders] delete drug order',
  props<{ drugOrderUuid: string }>()
);

export const clearDrugOrdersStore = createAction(
  '[Drug orders] clear drug orders'
);

export const setDrugOrderEncounter = createAction(
  '[Drug orders] set drug order encounter',
  props<{ drugOrderEncounter: any }>()
);

export const notifyDoctor = createAction(
  '[Drug Order] notify doctor',
  props<{ 
    doctorUuid: string;
    drugOrder: DrugOrderObject;
    patientInfo?: any;
  }>()
);
export const notifyDoctorSuccess = createAction(
  '[Drug Order] notify doctor success',
  props<{ 
    doctorUuid: string;
    drugOrder: DrugOrderObject;
  }>()
);
export const notifyDoctorFail = createAction(
  '[Drug Order] notify doctor fail',
  props<{ 
    error: any;
    doctorUuid: string;
  }>()
);
export const batchNotifyDoctors = createAction(
  '[Drug Order] batch notify doctors',
  props<{ 
    drugOrders: DrugOrderObject[];
    patientInfo?: any;
  }>()
);
