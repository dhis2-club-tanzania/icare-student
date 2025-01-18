import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  loadPatientsDetails,
  addLoadedPatientsDetails,
  loadingPatientsFail,
  savePatientSample,
  addCollectedSample,
  setLabSampleStatus,
  updatePatientLabSample,
} from "../actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";

import * as _ from "lodash";
import { PatientService } from "src/app/shared/services/patient.service";
import { SamplesService } from "src/app/shared/services/samples.service";
import { formatPatientDetails } from "src/app/shared/helpers/patient.helper";

@Injectable()
export class PatientsEffects {
  constructor(
    private actions$: Actions,
    private patientService: PatientService,
    private sampleService: SamplesService
  ) {}

  patientDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPatientsDetails),
      switchMap((action) =>
        this.patientService.getPatientsDetails(action.patientId).pipe(
          map((details) =>
            addLoadedPatientsDetails({
              patient: formatPatientDetails(details),
            })
          ),
          catchError((error) => of(loadingPatientsFail({ error })))
        )
      )
    )
  );

  patientSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savePatientSample),
      switchMap((action) =>
        this.sampleService.collectSample(action.sample).pipe(
          switchMap((sampleResponse) => {
            const formattedSample = {
              ...action.details,
              collected: true,
              orders: _.map(action.details?.orders, (order) => {
                return {
                  ...order,
                  priority: action?.priorityDetails?.status,
                  collected: true,
                  sample_identifier: action?.sample?.label,
                  specimen_id: order?.orderDetails?.specimenUuid,
                };
              }),
            };

            const statusDetails =
              action?.priorityDetails?.status &&
              (action?.priorityDetails?.status == "HIGH" ||
                action?.priorityDetails?.status == "Urgent")
                ? {
                    sample: {
                      uuid: sampleResponse?.uuid,
                    },
                    user: action?.priorityDetails?.user,
                    remarks: "high priority",
                    status: "Urgent",
                  }
                : null;
            // console.log(formattedSample);
            return [
              addCollectedSample({
                sample: formattedSample,
              }),
              setLabSampleStatus({
                statusDetails: statusDetails,
                sample: formattedSample,
              }),
            ];
          })
        )
      )
    )
  );

  labSampleStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setLabSampleStatus),
      switchMap((action) => {
        return this.sampleService.setSampleStatus(action.statusDetails).pipe(
          map((statusResponse) => {
            const updatedSample = { ...action.sample };
            return updatePatientLabSample({ sample: updatedSample });
          })
        );
      })
    )
  );
}
