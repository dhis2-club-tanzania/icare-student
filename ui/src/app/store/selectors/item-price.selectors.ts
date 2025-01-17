import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemPriceAdapter, ItemPriceState } from '../states/item-price.state';

const getItemPriceState = createFeatureSelector<ItemPriceState>('itemPrice');

export const {
  selectEntities: getItemPriceEntities,
} = itemPriceAdapter.getSelectors(getItemPriceState);

export const getItemPriceLoadingStatus = createSelector(
  getItemPriceState,
  (itemPriceState: ItemPriceState) => itemPriceState.loading
);
