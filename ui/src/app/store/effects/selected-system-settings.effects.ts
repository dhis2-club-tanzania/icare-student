import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import {
  addLoadedSystemSettings,
  loadSystemSettings,
  loadingSystemSettingsFails,
} from "../actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class SystemSettingsEffect {
  constructor(
    private actions$: Actions,
    private systemSettingsService: SystemSettingsService
  ) {}

  loadSystemSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSystemSettings),
      switchMap((action) =>
        this.systemSettingsService
          .getSystemSettingsDetailsByKeys(action.settingsKeyReferences)
          .pipe(
            map((response) => {
              return addLoadedSystemSettings({ systemSettings: response });
            }),
            catchError((error) => {
              return of(loadingSystemSettingsFails({ error }));
            })
          )
      )
    )
  );
}
