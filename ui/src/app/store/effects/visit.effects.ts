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
import {
  clearSamples,
  clearSamplesToCollect,
} from "src/app/modules/laboratory/store/actions";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import {
  addLabOrders,
  addLoadedRadiologyOrders,
  admitPatient,
  clearDrugOrdersStore,
  clearFailedOrders,
  clearLabOrders,
  clearRadiologyOrders,
  go,
  loadDrugOrders,
} from "../actions";
import { clearBills, loadPatientBills } from "../actions/bill.actions";
import { clearDiagnosis, upsertDiagnoses } from "../actions/diagnosis.actions";
import {
  clearObservations,
  upsertObservations,
} from "../actions/observation.actions";
import {
  activeVisitNotFound,
  clearVisits,
  holdVisitState,
  loadActiveVisit,
  loadVisitFail,
  startVisit,
  updateVisit,
  upsertVisit,
  upsertVisitDeathCheck,
} from "../actions/visit.actions";
import { AppState } from "../reducers";
import { getCurrentLocation } from "../selectors";
import { getCurrentPatient } from "../selectors/current-patient.selectors";
import { getProviderDetails } from "../selectors/current-user.selectors";

@Injectable()
export class VisitEffects {
  startVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startVisit),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(getCurrentPatient)),
            this.store.pipe(select(getCurrentLocation(false)))
          )
        )
      ),
      switchMap(([{ visit, isEmergency }, currentPatient, currentLocation]) => {
        this.notificationService.show(
          new Notification({
            message: "Starting patient visit...",
            type: "LOADING",
          })
        );
        return this.visitService
          .createVisit({
            ...visit,
            patient: currentPatient?.id,
          })
          .pipe(
            switchMap(() => {
              this.notificationService.show(
                new Notification({
                  message: "Patient visit successfully started",
                  type: "SUCCESS",
                })
              );
              return [
                loadActiveVisit({
                  patientId: currentPatient?.id,
                  isEmergency: isEmergency,
                }),
                loadPatientBills({ patientUuid: currentPatient?.id }),
              ];
            }),
            catchError((error) => {
              this.notificationService.show(
                new Notification({
                  message: "Error starting patient visit",
                  type: "ERROR",
                })
              );
              return of(loadVisitFail({ error }));
            })
          );
      })
    )
  );

  loadActiveVisit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadActiveVisit),
      withLatestFrom(this.store.select(getProviderDetails)),
      switchMap(
        ([{ patientId, isEmergency, isRegistrationPage }, provider]: [
          any,
          any
        ]) => {
          // this.store.dispatch(clearVisits());
          this.store.dispatch(clearDrugOrdersStore());
          this.store.dispatch(clearObservations());
          this.store.dispatch(clearDiagnosis());
          this.store.dispatch(clearLabOrders());
          this.store.dispatch(clearFailedOrders());
          this.store.dispatch(clearSamples());
          this.store.dispatch(clearSamplesToCollect());
          this.store.dispatch(clearRadiologyOrders());
          this.store.dispatch(clearBills());
          return this.visitService
            .getActiveVisit(patientId, false, false, isRegistrationPage)
            .pipe(
              switchMap((visitResponse: Visit) => {
                if (!visitResponse) {
                  return [activeVisitNotFound()];
                }

                const emergencyAdmissionEncounter = isEmergency
                  ? {
                      patient: patientId,
                      location: JSON.parse(
                        localStorage.getItem("currentLocation")
                      )?.uuid,
                      visitLocation: visitResponse?.location?.uuid,
                      form: null,
                      provider: provider?.uuid,
                      visit: visitResponse?.uuid,
                      encounterType: ICARE_CONFIG.admission.encounterTypeUuid,
                    }
                  : null;

                const visit: VisitObject = visitResponse?.toJson();

                const drugOrderUuids = (visitResponse?.drugOrders || []).map(
                  (order) => order?.toJson()?.uuid
                );

                const observations = (visitResponse?.observations || []).map(
                  (observation) => observation.toJson()
                );

                const diagnoses = (visitResponse?.diagnoses || []).map(
                  (diagnosis) => diagnosis.toJson()
                );

                const labOrders = (visitResponse?.labOrders || []).map(
                  (labOrder) => labOrder.toJson()
                );

                const radiologyOrders = (
                  visitResponse?.radiologyOrders || []
                ).map((radiologyOrder) => radiologyOrder.toJson());

                const procedureOrders = (
                  visitResponse?.procedureOrders || []
                ).map((procedureOrder) => procedureOrder.toJson());

                const markedAsDead = visit?.markedAsDead;

                /**
                 * TODO: change handling of different types of orders
                 */
                if (isRegistrationPage) {
                  return [
                    upsertVisit({ visit, activeVisitUuid: visit.uuid }),
                    isEmergency
                      ? admitPatient({
                          admissionDetails: emergencyAdmissionEncounter,
                          path: null,
                        })
                      : holdVisitState(),
                  ];
                } else {
                  return [
                    upsertVisit({ visit, activeVisitUuid: visit.uuid }),
                    isEmergency
                      ? admitPatient({
                          admissionDetails: emergencyAdmissionEncounter,
                          path: null,
                        })
                      : holdVisitState(),
                    loadDrugOrders({ uuids: drugOrderUuids }),
                    upsertObservations({ observations }),
                    upsertDiagnoses({ diagnoses }),
                    addLabOrders({ labOrders }),
                    addLoadedRadiologyOrders({ orders: radiologyOrders }),
                    upsertVisitDeathCheck({ markedAsDead }),
                  ];
                }
              }),
              catchError((error) => {
                this.notificationService.show(
                  new Notification({
                    message: "Failed to load current visit",
                    type: "ERROR",
                    autoClose: false,
                  })
                );
                return of(loadVisitFail({ error }));
              })
            );
        }
      )
    );
  });

  // updateVisit$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(updateVisit),
  //     switchMap((action) => {
  //       return this.visitService
  //         .updateVisit(action.visitUuid, action.details)
  //         .pipe(
  //           map((visitUpdateResponse) => {
  //             return upsertVisit({
  //               visit: visitUpdateResponse,
  //               activeVisitUuid: action.visitUuid,
  //             });
  //           })
  //         );
  //     })
  //   )
  // );

  updateVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateVisit),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentPatient)))
        )
      ),
      switchMap(([{ details, visitUuid }, currentPatient]) => {
        this.notificationService.show(
          new Notification({
            message: "Updating patient visit...",
            type: "LOADING",
          })
        );
        return this.visitService.updateVisit(visitUuid, details).pipe(
          switchMap(() => {
            this.notificationService.show(
              new Notification({
                message: "Patient visit successfully updated",
                type: "SUCCESS",
              })
            );
            return [
              loadActiveVisit({ patientId: currentPatient?.id }),
              loadPatientBills({ patientUuid: currentPatient?.id }),
            ];
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Error updating patient visit",
                type: "ERROR",
              })
            );
            return of(loadVisitFail({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private visitService: VisitsService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
