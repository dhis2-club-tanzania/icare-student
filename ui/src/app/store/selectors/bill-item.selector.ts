import { createFeatureSelector, createSelector } from '@ngrx/store';
import { billItemAdapter, BillItemState } from '../states/bill-item.state';
import { groupBy } from 'lodash';
import { BillItemObject } from 'src/app/modules/billing/models/bill-item-object.model';

const getBillItemState = createFeatureSelector<BillItemState>('billItem');

export const { selectAll: getAllBillItems } = billItemAdapter.getSelectors(
  getBillItemState
);

export const getBillItemsGroupedByBill = createSelector(
  getAllBillItems,
  (billItems: BillItemObject[]) => groupBy(billItems, 'bill')
);
