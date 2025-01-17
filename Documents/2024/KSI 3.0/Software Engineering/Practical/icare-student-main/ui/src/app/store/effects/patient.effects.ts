import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  NotificationService,
  Notification,
} from "src/app/shared/services/notification.service";
import {
  addCurrentPatient,
  admitPatient,
  failedToAdmitt,
  go,
  loadCurrentPatient,
  loadCurrentPatientFail,
  setAsAdmitted,
  setAsTransferred,
  transferPatient,
} from "../actions";
import {
  clearActiveVisit,
  loadActiveVisit,
  updateVisit,
} from "../actions/visit.actions";
import { AppState } from "../reducers";

@Injectable()
export class PatientEffects {
  loadCurrentPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentPatient),
      switchMap(({ uuid, isRegistrationPage }) => {
        return this.patientService.getPatient(uuid).pipe(
          switchMap((patient: Patient) => {
            return [
              addCurrentPatient({ patient, isRegistrationPage }),
              clearActiveVisit(),
            ];
          }),
          catchError((error) => of(loadCurrentPatientFail({ error })))
        );
      })
    )
  );

  setCurrentPatient$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addCurrentPatient),
      map(({ patient, isRegistrationPage }) =>
        loadActiveVisit({
          patientId: patient.id,
          isEmergency: null,
          isRegistrationPage,
        })
      )
    );
  });

  admitPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(admitPatient),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Admitting a patient",
            type: "LOADING",
          })
        );
        const visitUuid = action.admissionDetails?.visit;
        const visitDetails = {
          location: action.admissionDetails.visitLocation
            ? action.admissionDetails?.visitLocation
            : action.admissionDetails?.location,
        };
        return this.visitService.admitPatient(action.admissionDetails).pipe(
          switchMap((admissionResponse) => {
            this.notificationService.show(
              new Notification({
                message: "Successfully admitted a patient",
                type: "SUCCESS",
              })
            );
            if (action?.path) {
              return [
                go({ path: [action?.path] }),
                setAsAdmitted(),
                updateVisit({
                  details: visitDetails,
                  visitUuid: admissionResponse?.visit.uuid,
                }),
              ];
            } else {
              return [
                setAsAdmitted(),
                updateVisit({
                  details: visitDetails,
                  visitUuid: admissionResponse?.visit.uuid,
                }),
              ];
            }
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Failed to admit",
                type: "ERROR",
              })
            );
            return of(failedToAdmitt({ error }));
          })
        );
      })
    )
  );

  transferPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(transferPatient),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Transfering a patient",
            type: "LOADING",
          })
        );
        const visitUuid = action.transferDetails?.visit;
        const visitDetails = {
          location: action?.transferDetails
            ? action.transferDetails?.visitLocation
            : action?.currentVisitLocation,
          attributes: action?.visitAttributes,
        };
        this.store.dispatch(updateVisit({ details: visitDetails, visitUuid }));
        return this.visitService.transferPatient(action.transferDetails).pipe(
          switchMap((response) => {
            this.notificationService.show(
              new Notification({
                message: "Successfully transferred a patient",
                type: "SUCCESS",
              })
            );
            return [
              go({
                path: [action?.path],
                query: { queryParams: action.params },
              }),
              setAsTransferred(),
            ];
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private visitService: VisitsService,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private store: Store<AppState>
  ) {}
}
