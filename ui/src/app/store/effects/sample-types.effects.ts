import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  loadSampleTypesUuid,
  loadSampleTypes,
  addLoadedSampleTypes,
  loadingSampleTypesFails,
  addLoadedSampleTypeUuid,
  addLoadedSetMembers,
  loadLabConfigurations,
  setLabConfigurations,
  loadConfigsForLabOrdersManagement,
  loadLabOrdersMetaDataDependencies,
} from "../actions";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import * as _ from "lodash";
import { SampleTypesService } from "src/app/shared/services/sample-types.service";
import {
  formatSetMembers,
  formatSampleTypes,
} from "src/app/shared/helpers/sample-types.helper";

@Injectable()
export class SampleTypesEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private sampleTypesService: SampleTypesService
  ) {}

  sampleTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSampleTypes),
      switchMap((action) =>
        this.sampleTypesService.getSampleTypes().pipe(
          map((sampleTypedResponse) => {
            _.each(sampleTypedResponse, (sampletype) => {
              // console.log('setmembers to dispatch :: ', sampletype.setMembers);
              this.store.dispatch(
                addLoadedSetMembers({
                  SetMembers: formatSetMembers(
                    sampletype.setMembers,
                    sampletype.display,
                    "configs"
                  ),
                })
              );
            });

            return addLoadedSampleTypes({
              sampleTypes: formatSampleTypes(sampleTypedResponse),
            });
          }),
          catchError((error) => {
            return of(loadingSampleTypesFails({ error }));
          })
        )
      )
    )
  );

  labConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLabConfigurations),
      switchMap((action) =>
        this.sampleTypesService.getLabConfigurations().pipe(
          switchMap((configs) => {
            return [
              loadLabOrdersMetaDataDependencies({
                configs: configs?.results[0]
                  ? JSON.parse(configs?.results[0]?.value)
                  : null,
              }),
              setLabConfigurations({
                configs: JSON.parse(configs?.results[0]?.value),
              }),
            ];
          })
        )
      )
    )
  );

  labManagements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadConfigsForLabOrdersManagement),
      switchMap((action) =>
        this.sampleTypesService.getLabConfigurations().pipe(
          map((configs) => {
            return setLabConfigurations({
              configs: JSON.parse(configs?.results[0]?.value),
            });
          })
        )
      )
    )
  );
}
