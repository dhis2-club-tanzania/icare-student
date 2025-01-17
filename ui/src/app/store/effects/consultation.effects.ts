import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { Location } from "src/app/core/models";
import { EncounterType } from "src/app/shared/models/encounter-type.model";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { ConsultationService } from "src/app/shared/services";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { getEncounterTypeByUuid } from "src/app/store/selectors/encounter-type.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import {
  checkIfConsultationIsStarted,
  createDiagnosticEncounter,
  finishConsultation,
  startConsultation,
  startConsultationError,
  upsertConsultation,
} from "../actions/consultation.actions";
import { getConsultationActiveVisit } from "../selectors/consultation.selectors";

@Injectable()
export class ConsultationEffects {
  startConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startConsultation),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(getProviderDetails),
            this.store.pipe(select(getCurrentPatient)),
            this.store.pipe(select(getCurrentLocation(false))),
            this.store.pipe(select(getActiveVisit)),
            this.store.pipe(
              select(getEncounterTypeByUuid, {
                uuid: ICARE_CONFIG?.consultation?.encounterTypeUuid,
              })
            )
          )
        )
      ),
      switchMap(
        ([
          {},
          provider,
          currentPatient,
          currentLocation,
          activeVisit,
          encounterType,
        ]: [any, any, Patient, Location, VisitObject, EncounterType]) => {
          const localStorageConsultation = JSON.parse(
            localStorage.getItem("patientConsultation")
          );

          const patientConsultation =
            currentPatient &&
            localStorageConsultation?.patientUuid === currentPatient.id
              ? localStorageConsultation
              : null;
          if (patientConsultation) {
            return of(patientConsultation).pipe(
              switchMap((localStorageConsultation) => {
                return [
                  upsertConsultation({
                    consultation: {
                      encounterUuid: localStorageConsultation.encounterUuid,
                    },
                  }),
                ];
              })
            );
          }

          this.notificationService.show(
            new Notification({
              message: "Starting patient consultation...",
              type: "LOADING",
            })
          );

          const patientConsultationData = {
            visit: activeVisit?.uuid,
            patient: currentPatient?.id,
            encounterType: ICARE_CONFIG?.consultation?.encounterTypeUuid,
            location: currentLocation?.uuid,
            // TODO: Find best way to get encounter provider details
            encounterProviders: [
              {
                provider: provider?.uuid,
                encounterRole: "240b26f9-dd88-4172-823d-4a8bfeb7841f",
              },
            ],
          };
          return this.consultationService.start(patientConsultationData).pipe(
            switchMap((consultation) => {
              localStorage.setItem(
                "patientConsultation",
                JSON.stringify({
                  ...consultation,
                  patientUuid: currentPatient?.id,
                })
              );
              this.notificationService.show(
                new Notification({
                  message: "Patient consultation started!",
                  type: "SUCCESS",
                })
              );
              return [upsertConsultation({ consultation })];
            }),
            catchError((error) => {
              this.notificationService.show(
                new Notification({
                  message: "Problem starting consultation",
                  type: "ERROR",
                })
              );

              return of(startConsultationError({ error }));
            })
          );
        }
      )
    )
  );

  createEncounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDiagnosticEncounter),
      withLatestFrom(
        this.store.select(getProviderDetails),
        this.store.pipe(select(getCurrentPatient)),
        this.store.pipe(select(getCurrentLocation(false))),
        this.store.pipe(select(getActiveVisit))
      ),
      switchMap(
        ([{}, provider, currentPatient, location, visit]: [
          any,
          any,
          any,
          any,
          any
        ]) => {
          const patientConsultationData = {
            visit: visit?.uuid,
            patient: currentPatient?.id,
            encounterType: "4d015850-5ab0-4fea-9568-9c2fe8ea2608",
            location: location?.uuid,
            // TODO: Find best way to get encounter provider details and soft coding encounter type
            encounterProviders: [
              {
                provider: provider?.uuid,
                encounterRole: ICARE_CONFIG.encounterRole.uuid,
              },
            ],
          };
          return this.consultationService.start(patientConsultationData).pipe(
            map((consultation) => {
              localStorage.setItem(
                "patientConsultation",
                JSON.stringify({
                  ...consultation,
                  patientUuid: currentPatient?.id,
                })
              );
              return upsertConsultation({ consultation });
            })
          );
        }
      )
    )
  );

  checkIfConsultationIsStated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(checkIfConsultationIsStarted),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(getConsultationActiveVisit)))
          )
        ),
        tap(([{}, consultationVisit]: [any, VisitObject]) => {
          const consultationDetailsLocalOnLocalStorage =
            JSON.parse(localStorage.getItem("patientConsultation")) || {};
          if (
            consultationDetailsLocalOnLocalStorage &&
            !consultationDetailsLocalOnLocalStorage["encounterUuid"]
          ) {
            this.store.dispatch(go({ path: ["/clinic"] }));
          }
        })
      ),
    { dispatch: false }
  );

  finishConsultation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(finishConsultation),
        tap(() => {
          localStorage.removeItem("patientConsultation");
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private consultationService: ConsultationService,
    private notificationService: NotificationService
  ) {}
}
