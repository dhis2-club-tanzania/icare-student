import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { BillItemObject } from '../../modules/billing/models/bill-item-object.model';

export const upsertPatientBillItems = createAction(
  '[Billing] Upsert patient bill items',
  props<{ billItems: BillItemObject[] }>()
);

export const upsertPatientBillItem = createAction(
  '[Billing] Upsert patient bill item',
  props<{ billItem: BillItemObject }>()
);

export const updatePatientBillItem = createAction(
  '[Billing] Update patient bill item',
  props<{ id: string; changes: Partial<BillItemObject> }>()
);
export const updatePatientBillItems = createAction(
  '[Billing] Update patient bill items',
  props<{ billItems: Update<BillItemObject>[] }>()
);

export const confirmPatientBillItem = createAction(
  '[Billing] Confirm patient bill item',
  props<{ billItem: BillItemObject }>()
);

export const clearBillItems = createAction('[Billing] Clear bill items');

export const clearPaidBillItems = createAction(
  '[Billing] clear paid bill items',
  props<{ ids: string[] }>()
);
