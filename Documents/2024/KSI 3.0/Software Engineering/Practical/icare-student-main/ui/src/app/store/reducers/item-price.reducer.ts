import { Action, createReducer, on } from '@ngrx/store';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from 'src/app/store/states/base.state';
import { ItemPrice } from '../../modules/maintenance/models/item-price.model';
import {
  addItemPrices,
  loadItemPrices,
  loadItemPricesFails,
  saveItemPrice,
  upsertItemPrice,
} from '../actions/pricing-item.actions';
import {
  initialItemPriceState,
  itemPriceAdapter,
  ItemPriceState,
} from '../states/item-price.state';

const reducer = createReducer(
  initialItemPriceState,
  on(loadItemPrices, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addItemPrices, (state, { itemPrices }) =>
    itemPriceAdapter.addMany(itemPrices, { ...state, ...loadedBaseState })
  ),
  on(loadItemPricesFails, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(saveItemPrice, (state, { itemPrice }) => {
    const sanitizedItemPrice = new ItemPrice(itemPrice).toJson();
    return itemPriceAdapter.upsertOne(sanitizedItemPrice, state);
  }),
  on(upsertItemPrice, (state, { itemPrice }) =>
    itemPriceAdapter.upsertOne(itemPrice, state)
  )
);

export function itemPriceReducer(
  state: ItemPriceState,
  action: Action
): ItemPriceState {
  return reducer(state, action);
}
