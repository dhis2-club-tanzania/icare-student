import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PricingItemInterface } from 'src/app/modules/maintenance/models/pricing-item.model';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';

export interface PricingItemState
  extends EntityState<PricingItemInterface>,
    BaseState {
  initiated: boolean;
}

export const pricingItemAdapter: EntityAdapter<PricingItemInterface> = createEntityAdapter<
  PricingItemInterface
>({});

export const initialPricingItemState: PricingItemState = pricingItemAdapter.getInitialState(
  {
    ...initialBaseState,
    initiated: false,
  }
);
