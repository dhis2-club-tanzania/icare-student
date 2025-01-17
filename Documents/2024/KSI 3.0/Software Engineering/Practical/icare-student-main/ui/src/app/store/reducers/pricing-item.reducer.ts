import { Action, createReducer, on } from "@ngrx/store";
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from "src/app/store/states/base.state";
import {
  addPricingItems,
  clearPricingItems,
  initiateLoadingPricingItem,
  initiatePricingItems,
  loadPricingItems,
  loadPricingItemsFails,
  upsertItemPrice,
  upsertPricingItem,
} from "../actions/pricing-item.actions";
import {
  initialPricingItemState,
  pricingItemAdapter,
  PricingItemState,
} from "../states/pricing-item.state";

import { keyBy, unionBy } from "lodash";

const reducer = createReducer(
  initialPricingItemState,
  on(loadPricingItems, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addPricingItems, (state, { pricingItems }) =>
    pricingItemAdapter.addMany(pricingItems, { ...state, ...loadedBaseState })
  ),
  on(loadPricingItemsFails, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(initiateLoadingPricingItem, (state) => ({ ...state, initiated: true })),
  on(upsertPricingItem, (state, { pricingItem }) =>
    pricingItemAdapter.upsertOne(pricingItem, state)
  ),
  on(upsertItemPrice, (state, { itemPrice }) => {
    const applicableSchemes = keyBy(
      state.entities[itemPrice?.id].prices.map((price) => {
        return {
          schemeId: price?.paymentScheme?.uuid,
        };
      }),
      "schemeId"
    );
    const pricingItem = {
      id: itemPrice?.id,
      ...state.entities[itemPrice?.id],
      prices: !applicableSchemes[itemPrice?.paymentScheme?.uuid]
        ? [...state.entities[itemPrice?.id]?.prices, itemPrice]
        : unionBy(
            itemPrice,
            state.entities[itemPrice?.id]?.prices,
            "paymentSchemeUuid"
          ),
    };
    return pricingItemAdapter.upsertOne(pricingItem, state);
  }),
  on(clearPricingItems, (state) => pricingItemAdapter.removeAll(state))
);

export function pricingItemReducer(
  state: PricingItemState,
  action: Action
): PricingItemState {
  return reducer(state, action);
}
