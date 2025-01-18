import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ItemPriceInterface } from 'src/app/modules/maintenance/models/item-price.model';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';

export interface ItemPriceState
  extends EntityState<ItemPriceInterface>,
    BaseState {}

export const itemPriceAdapter: EntityAdapter<ItemPriceInterface> = createEntityAdapter<
  ItemPriceInterface
>({});

export const initialItemPriceState: ItemPriceState = itemPriceAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
