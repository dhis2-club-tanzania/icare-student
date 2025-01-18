import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { Observation } from "src/app/shared/resources/observation/models/observation.model";
import { ObservationService } from "src/app/shared/resources/observation/services";
import {
  clearObservations,
  saveObservations,
  saveObservationsFail,
  saveObservationsForFiles,
  saveObservationsUsingEncounter,
  upsertObservations,
} from "../actions/observation.actions";
import { AppState } from "../reducers";
import {
  NotificationService,
  Notification,
} from "src/app/shared/services/notification.service";
import { loadActiveVisit } from "../actions/visit.actions";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { getProviderDetails } from "../selectors/current-user.selectors";
import { getActiveVisit } from "../selectors/visit.selectors";

@Injectable()
export class ObservationEffects {
  saveObservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveObservations),
      withLatestFrom(
        this.store.pipe(select(getProviderDetails)),
        this.store.select(getActiveVisit)
      ),
      // concatMap((action) => of(action).pipe(withLatestFrom(this.store.)))
      switchMap(
        ([{ observations, patientId }, provider, visit]: [any, any, any]) => {
          this.notificationService.show(
            new Notification({
              message: "Saving Observations...",
              type: "LOADING",
            })
          );
          const observationsDetails = {
            obs: observations,
            encounterUuid: observations[0]?.encounter,
          };

          const data = {
            visit: visit?.uuid,
            patient: visit?.patientUuid,
            encounterType: ICARE_CONFIG?.consultation?.encounterTypeUuid,
            location: JSON.parse(localStorage.getItem("currentLocation"))?.uuid,
            obs: observations,
            orders: [],
            encounterProviders: [
              {
                provider: provider?.uuid,
                encounterRole: ICARE_CONFIG.encounterRole,
              },
            ],
          };

          return this.observationService
            .saveObservationsViaEncounter(data)
            .pipe(
              switchMap((observationResults: any) => {
                this.notificationService.show(
                  new Notification({
                    message: "Observations successfully saved!",
                    type: "SUCCESS",
                  })
                );
                return [
                  upsertObservations({
                    observations: observationResults?.obs,
                  }),
                ];
              }),
              catchError((error) => {
                this.notificationService.show(
                  new Notification({
                    message: "Error saving observations!",
                    type: "ERROR",
                  })
                );

                return of(saveObservationsFail({ error }));
              })
            );
        }
      )
    )
  );

  saveObservationsUsingEncounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveObservationsUsingEncounter),
      // concatMap((action) => of(action).pipe(withLatestFrom(this.store.)))
      switchMap(({ data, patientId }) => {
        this.notificationService.show(
          new Notification({
            message: "Saving Observations...",
            type: "LOADING",
          })
        );

        return this.observationService.saveEncounterWithObsDetails(data).pipe(
          switchMap((observationResults: any) => {
            this.notificationService.show(
              new Notification({
                message: "Observations successfully saved!",
                type: "SUCCESS",
              })
            );
            return [
              data?.fileObs && data?.fileObs?.length > 0
                ? saveObservationsForFiles({
                    data: data?.fileObs,
                    patientId,
                    encounter: observationResults?.uuid,
                  })
                : null,
              upsertObservations({
                observations: observationResults?.obs,
              }),
              loadActiveVisit({ patientId }),
            ];
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Error saving observations!",
                type: "ERROR",
              })
            );

            return of(saveObservationsFail({ error }));
          })
        );
      })
    )
  );

  saveObservationFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveObservationsForFiles),
      switchMap(({ data, patientId, encounter }) => {
        const obsData = data?.map((obsDetails) => {
          return {
            ...obsDetails,
            encounter: encounter,
            obsDatetime: new Date(),
            voided: false,
            status: "PRELIMINARY",
          };
        });
        return this.observationService.saveObsDetailsForFiles(obsData).pipe(
          switchMap((observationResults: any) => {
            this.notificationService.show(
              new Notification({
                message: "Observations successfully saved!",
                type: "SUCCESS",
              })
            );
            return [
              upsertObservations({
                observations: observationResults?.obs,
              }),
              loadActiveVisit({ patientId }),
            ];
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Error saving observations!",
                type: "ERROR",
              })
            );

            return of(saveObservationsFail({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private observationService: ObservationService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
