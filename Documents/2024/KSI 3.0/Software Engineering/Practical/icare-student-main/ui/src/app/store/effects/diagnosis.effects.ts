import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DiagnosisService } from 'src/app/shared/resources/diagnosis/services';
import { AppState } from '../reducers';
import {
  upsertDiagnosis,
  saveDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  removeDiagnosis,
} from '../actions/diagnosis.actions';
import { switchMap, map } from 'rxjs/operators';
import { Diagnosis } from 'src/app/shared/resources/diagnosis/models/diagnosis.model';
import {
  NotificationService,
  Notification,
} from 'src/app/shared/services/notification.service';

@Injectable()
export class DiagnosisEffects {
  constructor(
    private actions$: Actions,
    private diagnosisService: DiagnosisService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  diagnosis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveDiagnosis),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: 'Saving diagnosis',
            type: 'LOADING',
          })
        );
        return this.diagnosisService
          .addDiagnosis(action.diagnosis, action.currentDiagnosisUuid)
          .pipe(
            map((diagnosisResponse) => {
              this.notificationService.show(
                new Notification({
                  message: 'Successfully saved diagnosis',
                  type: 'SUCCESS',
                })
              );
              return upsertDiagnosis({
                diagnosis: new Diagnosis(diagnosisResponse),
              });
            })
          );
      })
    )
  );

  updateDdiagnosis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDiagnosis),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: 'Updating diagnosis',
            type: 'LOADING',
          })
        );
        return this.diagnosisService
          .addDiagnosis(action.diagnosis, action.uuid)
          .pipe(
            map((diagnosisResponse) => {
              this.notificationService.show(
                new Notification({
                  message: 'Successfully saved diagnosis',
                  type: 'SUCCESS',
                })
              );
              return upsertDiagnosis({
                diagnosis: new Diagnosis(diagnosisResponse).toJson(),
              });
            })
          );
      })
    )
  );

  deleteDiagnosis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDiagnosis),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: 'Deleting diagnosis',
            type: 'LOADING',
          })
        );
        return this.diagnosisService.deleteDiagnosis(action.uuid).pipe(
          map((diagnosisResponse) => {
            this.notificationService.show(
              new Notification({
                message: 'Successfully deleted diagnosis',
                type: 'SUCCESS',
              })
            );
            return removeDiagnosis({ uuid: action?.uuid });
          })
        );
      })
    )
  );
}
