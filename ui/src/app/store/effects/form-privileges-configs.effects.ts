import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SystemSettingsService } from 'src/app/core/services/system-settings.service';
import {
  addLoadedFormPrivilegesConfigs,
  loadFormPrivilegesConfigs,
  loadingFormPrivilegesHasError,
} from '../actions/form-privileges-configs.actions';

@Injectable()
export class FormPrivilegesConfigsEffects {
  constructor(
    private systemSettingsService: SystemSettingsService,
    private actions$: Actions
  ) {}

  formPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFormPrivilegesConfigs),
      switchMap(() => {
        return this.systemSettingsService.getFormPrivilegesConfigs().pipe(
          map((response) => {
            return addLoadedFormPrivilegesConfigs({ formPrivileges: response });
          }),
          catchError((error) => of(loadingFormPrivilegesHasError(error)))
        );
      })
    )
  );
}
