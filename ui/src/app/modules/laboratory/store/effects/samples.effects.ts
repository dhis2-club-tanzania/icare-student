import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SamplesService } from "../../resources/services/samples.service";
import {
  createSample,
  upsertSample,
  creatingSampleFails,
  requestSampleIdentifier,
  upsertSampleIdentifierDetails,
  upsertSamples,
  setSampleStatus,
  addLabTestResults,
  signOffLabTestResult,
  setContainerForLabTest,
  updateSampleOnStore,
  allocateTechnicianToLabTest,
  loadSamplesByVisit,
  loadAllLabSamples,
  upsertSamplesToCollect,
} from "../actions";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { of } from "rxjs";
import {
  addSampleStatusToSample,
  addResultToOrderInTheSample,
  setSignOffToTestInTheSample,
  setContaincerToTestInTheSample,
  addTestAllocationDetailsToSample,
  mergeSampleCreationResponseAndGroupOrders,
} from "../../resources/helpers";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getSpecimenSources } from "../selectors/specimen-sources-and-tests-management.selectors";

import * as _ from "lodash";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import {
  keyDepartmentsByTestOrder,
  keySampleTypesByTestOrder,
} from "src/app/shared/helpers/sample-types.helper";
import { calculateAgeUsingBirthDate } from "src/app/core/helpers/calculate_age.helper";

@Injectable()
export class SamplesEffects {
  constructor(
    private actions$: Actions,
    private sampleService: SamplesService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  sampleCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSample),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Creating sample with id " + action?.sample?.id,
            type: "LOADING",
          })
        );
        return this.sampleService.createSample(action.sample).pipe(
          map((sampleCreateResponse) => {
            this.notificationService.show(
              new Notification({
                message: "Successfully created sample",
                type: "SUCCESS",
              })
            );
            return upsertSample({
              sample: mergeSampleCreationResponseAndGroupOrders(
                action?.sample,
                sampleCreateResponse
              ),
            });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Failed to create sample",
                type: "ERROR",
              })
            );
            return of(creatingSampleFails({ error }));
          })
        );
      })
    )
  );

  allLabSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllLabSamples),
      withLatestFrom(
        this.store.pipe(
          select(getSpecimenSources, { name: "Specimen sources" })
        )
      ),
      switchMap(([{}, specimenSources]) => {
        this.notificationService.show(
          new Notification({
            message: "Loading samples",
            type: "LOADING",
          })
        );
        return this.sampleService.getAllSamples().pipe(
          map((samplesResponse) => {
            /**
             * TODO: Move to helper and accomodate all statuses related to sample
             */
            const formattedSamples = _.map(samplesResponse, (sample) => {
              return {
                id: sample?.label,
                uuid: sample?.uuid,
                specimenSourceName: (getSpecimenSourceByUuid(
                  specimenSources,
                  sample?.concept?.uuid
                ) || [])[0]?.display,
                specimenSourceUuid: sample?.concept?.uuid,
                departmentSpecimentSource: sample?.departmentSpecimentSource,
                mrNo: getmRN(sample?.patient),
                patient: sample?.patient,
                orders: _.map(sample?.orders, (order) => {
                  return {
                    ...order?.order,
                    technician: order?.technician,
                    sample: order?.sample,
                    testAllocations: order?.testAllocations,
                  };
                }),
                priority: sample.priority ? "Urgent" : "Routine",
                allocation: sample?.testsAllocation,
                status:
                  sample?.statuses && sample?.statuses?.length > 0
                    ? getRejectOrAcceptStatus(sample?.statuses)
                    : null,

                comments:
                  sample?.statuses && sample?.statuses?.length > 0
                    ? getCommentsForAcceptanceOrRejectioon(sample?.statuses)
                    : null,
                user:
                  sample?.statuses && sample?.statuses?.length > 0
                    ? getUserRejectedOrAccepted(sample?.statuses)
                    : null,
              };
            });

            function getRejectOrAcceptStatus(statusesInfo) {
              let status = "";
              _.each(statusesInfo, (statusInfo) => {
                if (
                  statusInfo?.status.toUpperCase() == "ACCEPTED" ||
                  statusInfo?.status.toUpperCase() == "REJECTED"
                ) {
                  status = statusInfo?.status.toUpperCase();
                }
              });
              return status;
            }

            function getUserRejectedOrAccepted(statusesInfo) {
              let user = null;
              _.each(statusesInfo, (statusInfo) => {
                if (
                  statusInfo?.status.toUpperCase() == "ACCEPTED" ||
                  statusInfo?.status.toUpperCase() == "REJECTED"
                ) {
                  user = statusInfo?.user;
                }
              });
              return user;
            }

            function getCommentsForAcceptanceOrRejectioon(statusesInfo) {
              let comments = null;
              _.each(statusesInfo, (statusInfo) => {
                if (
                  statusInfo?.status.toUpperCase() == "ACCEPTED" ||
                  statusInfo?.status.toUpperCase() == "REJECTED"
                ) {
                  comments = statusInfo?.remarks;
                }
              });
              return comments;
            }

            function getmRN(patient) {
              let mrNo = "";
              _.map(patient?.identifiers, (identifier) => {
                if (identifier?.name == "MRN") {
                  mrNo = identifier?.id;
                }
              });
              return mrNo;
            }

            function getSpecimenSourceByUuid(specimenSources, uuid) {
              return _.filter(specimenSources?.setMembers, { uuid: uuid });
            }
            this.notificationService.show(
              new Notification({
                message: "Successfully loaded samples",
                type: "SUCCESS",
              })
            );
            return upsertSamples({ samples: formattedSamples });
          })
        );
      })
    )
  );

  // TODO JESSE use sample lable api to get sample identifier
  sampleIdentifier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestSampleIdentifier),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Requesting Sample ID",
            type: "LOADING",
          })
        );
        return this.sampleService
          .generateSampleIdentifier(action.specimenType)
          .pipe(
            map((sampleIdentifier) => {
              // console.log('SAMPLE IDENTIFIERS :: ', sampleIdentifier);
              this.notificationService.show(
                new Notification({
                  message: "Successfully loaded sample ID",
                  type: "SUCCESS",
                })
              );
              return upsertSampleIdentifierDetails({ sampleIdentifier });
            })
          );
      })
    )
  );

  samplesByVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSamplesByVisit),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Loading orders and samples",
            type: "LOADING",
          })
        );
        return this.sampleService
          .getSamplesByVisit(
            action.visitUuid,
            action.orderedLabOrders,
            action.specimenSources,
            action.labDepartments,
            action.patient,
            action.paidItems
          )
          .pipe(
            switchMap((allSamples) => {
              // console.log("allSamples", allSamples);
              let samples = [];
              let samplesToCollect = [];
              // console.log("action.paidItems", action.paidItems);
              // TODO: Add a way to handle emergency visit and IPD through configurations
              _.forEach(allSamples, (sample) => {
                if (sample.hasOwnProperty("id")) {
                  samples = [...samples, sample];
                } else {
                  let formattedOrders = [];
                  _.map(sample?.orders, (order) => {
                    formattedOrders = [
                      ...formattedOrders,
                      {
                        ...order,
                        paid: action.paidItems[order?.uuid] ? true : false,
                        isEnsured: action.visit.isEnsured,
                        isEmergency: action.visit.isEmergency,
                        isAdmitted: action.visit.isAdmitted,
                      },
                    ];
                  });
                  sample["orders"] = formattedOrders;
                  samplesToCollect = [
                    ...samplesToCollect,
                    {
                      ...sample,
                      isEnsured: action.visit.isEnsured,
                      isEmergency: action.visit.isEmergency,
                      isAdmitted: action.visit.isAdmitted,
                      atLeastOnePaid:
                        (_.filter(formattedOrders, { paid: true }) || [])
                          ?.length > 0
                          ? true
                          : false,
                      allPaid:
                        (_.filter(formattedOrders, { paid: true }) || [])
                          ?.length == sample?.orders?.length,
                    },
                  ];
                }
              });
              // console.log("samplesToCollect", samplesToCollect);
              // const filteredSamplesToCollect =
              //   samplesToCollect.filter(
              //     (sampleToCollect) =>
              //       (
              //         samples.filter(
              //           (sample) =>
              //             sample?.departmentSpecimentSource ===
              //             sampleToCollect?.departmentSpecimentSource
              //         ) || []
              //       ).length === 0
              //   ) || [];
              this.notificationService.show(
                new Notification({
                  message: "Successfully loaded lab orders",
                  type: "SUCCESS",
                })
              );
              return [
                upsertSamples({ samples }),
                upsertSamplesToCollect({
                  samplesToCollect,
                }),
              ];
            })
          );
      })
    )
  );

  setSampleStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSampleStatus),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message:
              "Saving sample " + action.sampleStatusDetails?.status + " status",
            type: "LOADING",
          })
        );
        return this.sampleService
          .setSampleStatus(action?.sampleStatusDetails, action?.sample?.uuid)
          .pipe(
            map((statusCreateResponse) => {
              const updatedSample = addSampleStatusToSample(
                action.sample,
                statusCreateResponse
              );
              this.notificationService.show(
                new Notification({
                  message: "Successfully saved status",
                  type: "SUCCESS",
                })
              );
              return updateSampleOnStore({
                sample: {
                  id: updatedSample?.id,
                  changes: updatedSample,
                },
              });
            })
          );
      })
    )
  );

  allocateTechnicianToLabTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(allocateTechnicianToLabTest),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Saving assign to technician",
            type: "LOADING",
          })
        );
        return this.sampleService
          .setAllocation(action.orderWithAssignedPerson, action.sample)
          .pipe(
            map((allocationResponse) => {
              const editedSample = addTestAllocationDetailsToSample(
                action.sample,
                allocationResponse
              );
              this.notificationService.show(
                new Notification({
                  message: "Successfully saved",
                  type: "SUCCESS",
                })
              );
              return updateSampleOnStore({
                sample: {
                  id: editedSample?.id,
                  changes: editedSample,
                },
              });
            })
          );
      })
    )
  );

  labTestResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addLabTestResults),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Saving results",
            type: "LOADING",
          })
        );
        return this.sampleService
          .saveResultsForLabTest(action.labResultsDetails)
          .pipe(
            map((resultResponse) => {
              const sampleWithResults = addResultToOrderInTheSample(
                action.sample,
                resultResponse
              );
              this.notificationService.show(
                new Notification({
                  message: "Successfully saved result",
                  type: "SUCCESS",
                })
              );
              return updateSampleOnStore({
                sample: {
                  id: sampleWithResults?.id,
                  changes: sampleWithResults,
                },
              });
            })
          );
      })
    )
  );

  labResultSigOff$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOffLabTestResult),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Saving approval",
            type: "LOADING",
          })
        );
        return this.sampleService.setSignOffs(action.signOffDetails).pipe(
          map((sigOffResponse) => {
            const updatedSample = setSignOffToTestInTheSample(
              action.sample,
              sigOffResponse,
              action.signOffDetails?.testAllocation?.uuid
            );

            this.notificationService.show(
              new Notification({
                message: "Successfully saved approval",
                type: "SUCCESS",
              })
            );
            return updateSampleOnStore({
              sample: {
                id: updatedSample?.id,
                changes: updatedSample,
              },
            });
          })
        );
      })
    )
  );

  setContainer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setContainerForLabTest),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Saving container allocation",
            type: "LOADING",
          })
        );
        return this.sampleService
          .setContainerForLabTest(action.testToContainerDetails)
          .pipe(
            map((containerResponse) => {
              const updatedSample = setContaincerToTestInTheSample(
                action.sample,
                containerResponse,
                action?.testToContainerDetails?.testOrder?.uuid
              );
              this.notificationService.show(
                new Notification({
                  message: "Successfully saved container allocation",
                  type: "SUCCESS",
                })
              );
              return updateSampleOnStore({
                sample: {
                  id: updatedSample?.id,
                  changes: updatedSample,
                },
              });
            })
          );
      })
    )
  );
}
