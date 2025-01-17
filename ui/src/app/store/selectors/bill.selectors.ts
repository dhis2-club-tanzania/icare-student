import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BillObject } from "src/app/modules/billing/models/bill-object.model";
import { billAdapter, BillState } from "../states/bill.state";
import { getBillItemsGroupedByBill } from "./bill-item.selector";
import {
  getActiveVisit,
  getCurrentVisitServiceAttributeDetails,
  getCurrentVisitServiceBillingAttributeDetails,
} from "./visit.selectors";

const getBillState = createFeatureSelector<BillState>("bill");

export const { selectAll: getAllBills, selectEntities: getBillEntities } =
  billAdapter.getSelectors(getBillState);

export const getPatientBills = createSelector(
  getAllBills,
  getBillItemsGroupedByBill,
  (bills: BillObject[], groupedBillItems: any) => {
    // TODO: Implement support to filter bills by client
    return bills;
  }
);

export const getLoadingBillStatus = createSelector(
  getBillState,
  (state: BillState) => state.loading
);

export const getPatientBillLoadedStatus = createSelector(
  getBillState,
  (state: BillState) => state.loaded
);

export const getPatientPendingBillStatus = createSelector(
  getAllBills,
  (bills) => bills?.length > 0
);

export const getActiveVisitPendingVisitServiceBillStatus = createSelector(
  getAllBills,
  getCurrentVisitServiceBillingAttributeDetails,
  getActiveVisit,
  (bills, visitServiceAttributeDetails: any, activeVisit: any) => {
    if (activeVisit?.isEnsured) {
      return false;
    }
    if (
      activeVisit &&
      (
        activeVisit.attributes.filter(
          (attribute) =>
            attribute?.visitAttributeDetails?.attributeType?.display ===
            "Insurance ID"
        ) || []
      )?.length > 0
    ) {
      return false;
    } else if (
      activeVisit &&
      (
        activeVisit.attributes.filter(
          (attribute) =>
            attribute?.visitAttributeDetails?.attributeType?.display ===
            "Insurance ID"
        ) || []
      )?.length === 0 &&
      bills &&
      bills?.length > 0 &&
      visitServiceAttributeDetails
    ) {
      const billedServiceDetails =
        bills
          .map((bill) => {
            const matchedItems =
              bill.items?.filter((item: any) => {
                if (
                  item?.billItem?.item.concept?.uuid ===
                    visitServiceAttributeDetails.visitAttributeDetails?.value &&
                  bill?.visitUuid === activeVisit?.uuid
                ) {
                  return item;
                }
              }) || [];
            return {
              matchedItems,
            };
          })
          .filter((formattedBill) => {
            if (formattedBill?.matchedItems?.length > 0) {
              return formattedBill;
            }
          }) || [];
      return billedServiceDetails.length > 0;
    } else if (activeVisit && bills && bills?.length === 0) {
      return false;
    } else if (
      activeVisit &&
      !activeVisit?.isEnsured &&
      (bills.filter((bill) => bill?.visitUuid === activeVisit?.uuid) || [])
        .length === 0
    ) {
      return false;
    } else {
      return true;
    }
  }
);
