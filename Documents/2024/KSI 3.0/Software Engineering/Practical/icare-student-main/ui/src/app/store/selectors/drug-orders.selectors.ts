import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { drugOrderAdapter } from '../states';
import { uniqBy, groupBy, keys, find, flatten } from 'lodash';
import { getPatientBills, getAllBills } from './bill.selectors';
import { BillObject } from 'src/app/modules/billing/models/bill-object.model';
import { BillItem } from 'src/app/modules/billing/models/bill-item.model';

export const getDrugOrdersState = createSelector(
  getRootState,
  (state: AppState) => state.drugOrders
);

export const {
  selectAll: getAllDrugOrders,
  selectEntities: getDrugOrdersEntities,
} = drugOrderAdapter.getSelectors(getDrugOrdersState);

export const getAllUniqueDrugOrders = createSelector(
  getAllDrugOrders,
  getAllBills,
  (drugOrders, bills: BillObject[]) => {
    const groupedOrders = groupBy(drugOrders, 'concept.uuid');

    const uniqOrders = keys(groupedOrders)
      .map((conceptUuid) => {
        const groupedDrugOrders = groupedOrders[conceptUuid] || [];
        if (groupedDrugOrders.length === 1) {
          return groupedDrugOrders[0];
        }

        return groupedDrugOrders.filter((order) => order.drugUuid)[0];
      })
      .filter((order) => order);

    const billItems: BillItem[] = flatten(bills.map((bill) => bill?.items));

    return uniqOrders.map((order) => {
      const unpaidOrder = find(billItems, ['order.uuid', order.id]);

      //if no drug = not calc
      //if unpaid order = undef kimya
      //if unpaid order truthy = not paid
      //else paid

      return {
        ...order,
        paymentStatus: order?.drugUuid
          ? unpaidOrder == undefined
            ? ''
            : !unpaidOrder
            ? 'PAID'
            : 'NOT_PAID'
          : 'NOT_CALCULATED',
        amount: unpaidOrder?.amount,
      };

      // return {
      //   ...order,
      //   paymentStatus: order.drugUuid
      //     ? unpaidOrder
      //       ? 'NOT_PAID'
      //       : 'PAID'
      //     : 'NOT_CALCULATED',
      //   amount: unpaidOrder?.amount,
      // };
    });
  }
);

export const getTotalDrugOrderAmount = createSelector(
  getAllUniqueDrugOrders,
  (drugOrders) => {
    return (drugOrders || []).reduce(
      (sum, drugOrder) => sum + parseInt(drugOrder?.amount || 0, 10),
      0
    );
  }
);

export const getDrugOrderEncounter = createSelector(
  getDrugOrdersState,
  (state) => state.drugOrdeEncounterUuid
);

export const getDrugOrderLoadingStatus = createSelector(
  getDrugOrdersState,
  (state) => state.loading
);
