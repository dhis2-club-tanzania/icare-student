import { createFeatureSelector, createSelector } from "@ngrx/store";
import { getPaymentTypeLoadingState } from "src/app/store/selectors/payment-type.selectors";
import {
  pricingItemAdapter,
  PricingItemState,
} from "../states/pricing-item.state";

import { getItemPriceLoadingStatus } from "./item-price.selectors";

const getPricingItemState =
  createFeatureSelector<PricingItemState>("pricingItem");

export const { selectAll: getAllPricingItems } =
  pricingItemAdapter.getSelectors(getPricingItemState);

export const getPricingItemLoadingState = createSelector(
  getPricingItemState,
  getPaymentTypeLoadingState,
  getItemPriceLoadingStatus,
  (
    pricingItemState: PricingItemState,
    loadingPaymentTypes,
    loadingItemPrices
  ) => pricingItemState?.loading || loadingPaymentTypes || loadingItemPrices
);

export const getPricingItemInitiatedState = createSelector(
  getPricingItemState,
  (pricingItemState: PricingItemState) => pricingItemState?.initiated
);

// TODO only return stockable items
export const getAllStockableItems = createSelector(
  getAllPricingItems,
  (pricingItems) => pricingItems
);
