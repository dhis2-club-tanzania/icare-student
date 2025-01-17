import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { PricingService } from "src/app/shared/services/pricing.service";
import { AppState } from "src/app/store/reducers";
import { ItemPriceInterface } from "../../modules/maintenance/models/item-price.model";
import {
  addItemPrices,
  addPricingItems,
  clearPricingItems,
  initiateLoadingPricingItem,
  initiatePricingItems,
  loadItemPrices,
  loadItemPricesFails,
  loadPricingItems,
  loadPricingItemsFails,
  saveItemPrice,
  saveItemPriceFail,
  upsertItemPrice,
} from "../actions/pricing-item.actions";
import { getPricingItemInitiatedState } from "../selectors/pricing-item.selectors";

@Injectable()
export class PricingItemEffects {
  initiatePricingItems$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initiatePricingItems),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(getPricingItemInitiatedState))
            )
          )
        ),
        tap(([action, initiated]: [any, boolean]) => {
          // if (!initiated) {
          this.store.dispatch(clearPricingItems());
          this.store.dispatch(initiateLoadingPricingItem());
          this.store.dispatch(
            loadPricingItems({ filterInfo: action?.filterInfo })
          );
          // }
        })
      ),
    { dispatch: false }
  );
  loadPricingItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPricingItems),
      switchMap((action) =>
        this.pricingService.getItems(action.filterInfo).pipe(
          map((pricingItems) => {
            return addPricingItems({
              pricingItems: pricingItems.map((priceItem: any) => {
                return {
                  ...priceItem,
                  prices: priceItem?.prices.map((price) => {
                    return {
                      ...price,
                      paymentSchemeUuid: price?.paymentScheme?.uuid,
                    };
                  }),
                };
              }),
            });
          }),
          catchError((error) => of(loadPricingItemsFails({ error })))
        )
      )
    )
  );

  loadItemPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItemPrices),
      switchMap(() => {
        return this.pricingService.getItemPrices().pipe(
          map((itemPrices: ItemPriceInterface[]) =>
            addItemPrices({ itemPrices })
          ),
          catchError((error) => of(loadItemPricesFails({ error })))
        );
      })
    )
  );

  saveItemPrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveItemPrice),
      switchMap(({ itemPrice }) =>
        this.pricingService.saveItemPrice(itemPrice).pipe(
          map((itemPriceResult) => {
            return upsertItemPrice({
              itemPrice: {
                id: itemPriceResult?.item?.uuid,
                ...itemPriceResult,
                paymentSchemeUuid: itemPriceResult?.paymentScheme?.uuid,
              },
            });
          }),
          catchError((error) => of(saveItemPriceFail({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authService: AuthService,
    private pricingService: PricingService
  ) {}
}
