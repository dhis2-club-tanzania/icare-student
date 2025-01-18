import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { from, of } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { EncounterType } from "src/app/shared/models/encounter-type.model";
import { Api } from "src/app/shared/resources/openmrs";
import {
  initiateEncounterType,
  loadEncounterTypes,
  loadEncounterTypesFailed,
  upsertEncounterTypes,
} from "../actions/encounter-type.actions";
import { AppState } from "../reducers";
import { getAllEncounterTypes } from "../selectors/encounter-type.selectors";

@Injectable()
export class EncounterTypeEffects {
  initiateEncounterType$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initiateEncounterType),
        tap(() => {
          if (this.authService.isAuthenticated()) {
            this.store.dispatch(loadEncounterTypes());
          }
        })
      ),
    { dispatch: false }
  );
  loadEncounterTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEncounterTypes),
      withLatestFrom(this.store.select(getAllEncounterTypes)),
      switchMap(([action, encounterTypes]: [any, any]) => {
        if (!encounterTypes || encounterTypes?.length === 0) {
          return from(this.api.encountertype.getAllEncounterTypes()).pipe(
            map((res) => {
              const encounterTypes: EncounterType[] = (res?.results || [])
                .map((result: any) => {
                  if (!result) {
                    return null;
                  }

                  const { uuid, display } = result;
                  return {
                    id: uuid,
                    uuid,
                    display,
                  };
                })
                .filter((encounterType) => encounterType);
              return upsertEncounterTypes({ encounterTypes });
            }),
            catchError((error) => of(loadEncounterTypesFailed({ error })))
          );
        } else {
          return from([]);
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authService: AuthService,
    private api: Api
  ) {}
}
