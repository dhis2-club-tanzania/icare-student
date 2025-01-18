import { createAction, props } from "@ngrx/store";
import { ItemPriceInterface } from "../../modules/maintenance/models/item-price.model";
import { PricingItemInterface } from "../../modules/maintenance/models/pricing-item.model";

export const initiatePricingItems = createAction(
  "[PricingItem] initiate pricing items",
  props<{
    filterInfo: {
      limit: number;
      startIndex: number;
      searchTerm: string;
      conceptSet?: string;
      isDrug?: boolean;
    };
  }>()
);

export const loadPricingItems = createAction(
  "[PricingItem] load pricing items",
  props<{
    filterInfo: {
      limit: number;
      startIndex: number;
      searchTerm: string;
      conceptSet?: string;
      isDrug?: boolean;
    };
  }>()
);

export const addPricingItems = createAction(
  "[PricingItem] add pricing items",
  props<{ pricingItems: any }>()
);

export const loadPricingItemsFails = createAction(
  "[PricingItem] loading pricing items fails",
  props<{ error: any }>()
);

export const initiateLoadingPricingItem = createAction(
  "[PricingItem] initiate loading pricing items"
);

export const loadItemPrices = createAction("[PricingItem] load item prices");

export const addItemPrices = createAction(
  "[PricingItem] add item prices",
  props<{ itemPrices: ItemPriceInterface[] }>()
);

export const upsertPricingItem = createAction(
  "[PricingItem] upsert pricing item",
  props<{ pricingItem: PricingItemInterface }>()
);

export const loadItemPricesFails = createAction(
  "[PricingItem] loading item prices fails",
  props<{ error: any }>()
);

export const saveItemPrice = createAction(
  "[PricingItem] save item price",
  props<{ itemPrice: any }>()
);

export const upsertItemPrice = createAction(
  "[PricingItem] upsert item price",
  props<{ itemPrice: any }>()
);

export const saveItemPriceFail = createAction(
  "[PricingItem] save item price fail",
  props<{ error: any }>()
);

export const clearPricingItems = createAction(
  "[PricingItem] Clear Pricing Items"
);
