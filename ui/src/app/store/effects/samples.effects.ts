import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { from, of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  sample,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import {
  loadActiveVisitsForSampleManagement,
  loadingActiveVisitsForSamplesFails,
  saveObservation,
  updateSample,
  upsertCollectedSamples,
  upsertSample,
} from "../actions";

import * as _ from "lodash";
import { VisitsService } from "src/app/shared/services/visits.service";
import { AppState } from "../reducers";
import { groupAllActiveVisitsLabOrdersBySampleTypes } from "src/app/shared/helpers/patient.helper";

@Injectable()
export class SamplesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private visitsService: VisitsService
  ) {}

  visitsForSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActiveVisitsForSampleManagement),
      switchMap((action) => {
        return this.visitsService.getEmppty().pipe(
          map((response) => {
            const collectedSamples = groupAllActiveVisitsLabOrdersBySampleTypes(
              action.visits,
              action.sampleTypes,
              null
            );
            return upsertCollectedSamples({
              collectedSamples,
            });
          })
        );
      })
    )
  );

  saveObs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveObservation),
      switchMap((action) =>
        this.visitsService.saveObservation(action.observation).pipe(
          map((response) => {
            // update orders
            let formattedOrders = [];
            _.map(action.sample?.orders, (order) => {
              if (order?.concept?.uuid == response?.concept?.uuid) {
                formattedOrders = [
                  ...formattedOrders,
                  {
                    ...order,
                    result: response?.value,
                    obsUuid: response?.uuid,
                  },
                ];
              } else {
                formattedOrders = [...formattedOrders, order];
              }
            });
            formattedOrders = _.orderBy(formattedOrders, ["display"], ["asc"]);
            const sample = {
              ...action.sample,
              formattedOrders,
            };

            return updateSample({
              sample: {
                id: action.sample?.id,
                changes: sample,
              },
            });
          })
        )
      )
    )
  );

  //   createSample$ = createEffect(())
}
