import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { from, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  sample,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import {
  collectSample,
  creatingSampleFails,
  saveTestsContainerAllocation,
  setSampleStatus,
  updateLabSample,
  saveLabTestResults,
  saveLabTestResultsStatus,
  loadLabSamplesByCollectionDates,
  addFormattedLabSamples,
  loadLabSamplesByVisit,
  acceptSample,
  setSampleStatuses,
  loadSampleByUuid,
  addLoadedSample,
  loadSampleRejectionCodedReasons,
  addLoadedSampleRejectionCodedReasons,
  addSampleRejectionCodesReasons,
} from "../actions";

import * as _ from "lodash";
import { Store } from "@ngrx/store";
import { SamplesService } from "src/app/shared/services/samples.service";
import { AppState } from "../reducers";
import {
  keyDepartmentsByTestOrder,
  keySampleTypesByTestOrder,
} from "src/app/shared/helpers/sample-types.helper";
import { generateSelectionOptions } from "src/app/shared/helpers/patient.helper";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "../selectors/current-user.selectors";
import {
  formatAllocationResponsesByOrdersAfterAcceptingSample,
  formatTestAllocationsAfterApproval,
  formatTestsAllocations,
} from "src/app/shared/helpers/test-allocations.helper";
import {
  markSampleCollected,
  removeCollectedSampleFromSamplesToCollect,
} from "src/app/modules/laboratory/store/actions";
import { getLISConfigurations } from "../selectors/lis-configurations.selectors";

import * as moment from "moment";
import {
  getAllSampleTypes,
  getCodedSampleRejectionReassons,
  getLabDepartments,
  getLabTestsContainers,
} from "../selectors";
import { SampleTypesService } from "src/app/shared/services/sample-types.service";
import { getAuthorizationDetailsByOrder } from "src/app/core/helpers/lab-samples.helpers";

@Injectable()
export class LabSamplesEffects {
  constructor(
    private actions$: Actions,
    private sampleService: SamplesService,
    private store: Store<AppState>,
    private sampleTypesService: SampleTypesService
  ) {}

  labSample$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSampleByUuid),
      withLatestFrom(
        this.store.select(getLISConfigurations),
        this.store.select(getLabDepartments),
        this.store.select(getAllSampleTypes),
        this.store.select(getLabTestsContainers),
        this.store.select(getCodedSampleRejectionReassons)
      ),
      switchMap(
        ([
          action,
          lisConfigs,
          departments,
          sampleTypes,
          testContainers,
          codedSampleRejectionReasons,
        ]: [any, any, any, any, any, any]) => {
          return this.sampleService.getSampleByUuid(action?.uuid).pipe(
            map((response) => {
              const keyedDepartments = keyDepartmentsByTestOrder(departments);
              const keyedSpecimenSources =
                keySampleTypesByTestOrder(sampleTypes);
              const samples = _.map([response], (sample) => {
                const rejectionStatuses =
                  sample?.statuses?.filter(
                    (status) => status?.category?.indexOf("REJECTED") > -1
                  ) || [];
                return {
                  ...sample,
                  id: sample?.label,
                  specimen:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedSpecimenSources[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]
                      : "",
                  mrn: sample?.patient?.identifiers[0]?.id,
                  department:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedDepartments[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]
                      : null,
                  collected: true,
                  integrationStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "RESULTS_INTEGRATION"
                  ) || [])[0],
                  releasedStatuses: (
                    sample?.statuses?.filter(
                      (status) => status?.status === "RELEASED"
                    ) || []
                  ).map((status) => {
                    return {
                      ...status,
                      date:
                        new Date(status?.timestamp).toLocaleDateString() +
                        " " +
                        new Date(status?.timestamp).getHours().toString() +
                        ":" +
                        new Date(status?.timestamp).getMinutes().toString() +
                        " ( " +
                        moment(Number(status?.timestamp)).fromNow() +
                        " )",
                    };
                  }),
                  restrictedStatuses: (
                    sample?.statuses?.filter(
                      (status) => status?.status === "RESTRICTED"
                    ) || []
                  ).map((status) => {
                    return {
                      ...status,
                      date:
                        new Date(status?.timestamp).toLocaleDateString() +
                        " " +
                        new Date(status?.timestamp).getHours().toString() +
                        ":" +
                        new Date(status?.timestamp).getMinutes().toString() +
                        " ( " +
                        moment(Number(status?.timestamp)).fromNow() +
                        " )",
                    };
                  }),
                  reasonsForRejection:
                    rejectionStatuses?.length > 0
                      ? rejectionStatuses?.map((status) => {
                          return {
                            uuid: status?.status,
                            display: (codedSampleRejectionReasons?.filter(
                              (reason) => reason?.uuid === status?.status
                            ) || [])[0]?.display,
                          };
                        })
                      : null,
                  markedForRecollection:
                    sample?.statuses?.length > 0 &&
                    (_.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                      ?.status == "RECOLLECT" ||
                      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                        ?.category == "RECOLLECT")
                      ? true
                      : false,
                  rejected: rejectionStatuses?.length > 0 ? true : false,
                  rejectedBy:
                    rejectionStatuses?.length > 0
                      ? {
                          ...{
                            ...rejectionStatuses[0]?.user,
                            name: rejectionStatuses[0]?.user?.name?.split(
                              " ("
                            )[0],
                          },
                          ...rejectionStatuses[0],
                        }
                      : null,
                  departmentName:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedDepartments[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]?.departmentName
                      : null,
                  collectedBy: {
                    display: sample?.creator?.display?.split(" (")[0],
                    name: sample?.creator?.display?.split(" (")[0],
                    uid: sample?.creator?.uuid,
                  },
                  collectedByStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "COLLECTED_BY"
                  ) || [])[0],
                  collectedOnStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "COLLECTED_ON"
                  ) || [])[0],
                  acceptanceRemarksStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "ACCEPTANCE_REMARKS"
                  ) || [])[0],
                  broughtOnStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "DELIVERED_ON"
                  ) || [])[0],
                  registeredBy: {
                    display: sample?.creator?.display?.split(" (")[0],
                    name: sample?.creator?.display?.split(" (")[0],
                    uid: sample?.creator?.uuid,
                  },
                  sampleConditionStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "CONDITION"
                  ) || [])[0],
                  sampleTransportConditionStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "TRANSPORT_CONDITION"
                  ) || [])[0],
                  sampleTransportationTemperatureStatus:
                    (sample?.statuses?.filter(
                      (status) => status?.category === "TRANSPORT_TEMPERATURE"
                    ) || [])[0],
                  ordersWithResults: getOrdersWithResults(sample?.orders),
                  accepted:
                    (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])
                      ?.length > 0
                      ? true
                      : false,
                  acceptedBy: formatUserChangedStatus(
                    (_.filter(sample?.statuses, {
                      status: "ACCEPTED",
                    }) || [])[0]
                  ),
                  authorizationInfo: getAuthorizationDetails(sample),
                  acceptedAt: (_.filter(sample?.statuses, {
                    status: "ACCEPTED",
                  }) || [])[0]?.timestamp,
                  orders: _.map(sample?.orders, (order) => {
                    const allocationStatuses = _.flatten(
                      order?.testAllocations?.map((allocation) => {
                        return allocation?.statuses;
                      })
                    );
                    const formattedOrder = {
                      ...order,
                      authorizationInfo: getAuthorizationDetailsByOrder(order),
                      searchingText:
                        order?.order?.concept?.display?.toLowerCase() +
                        " " +
                        (
                          keyedSpecimenSources[
                            order?.order?.concept?.uuid
                          ]?.setMembers?.map((member) =>
                            member?.display?.toLowerCase()
                          ) || []
                        )?.join(" "),
                      order: {
                        ...order?.order,
                        concept: {
                          ...order?.order?.concept,
                          ...keyedSpecimenSources[order?.order?.concept?.uuid],
                          uuid: order?.order?.concept?.uuid,
                          display:
                            order?.order?.concept?.display?.indexOf(":") > -1
                              ? order?.order?.concept?.display?.split(":")[1]
                              : order?.order?.concept?.display,
                          selectionOptions:
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.hiNormal &&
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.lowNormal
                              ? generateSelectionOptions(
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.lowNormal,
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.hiNormal
                                )
                              : [],
                          setMembers:
                            keyedDepartments[order?.order?.concept?.uuid]
                              ?.setMembers?.length == 0
                              ? []
                              : _.map(
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.setMembers,
                                  (member) => {
                                    return {
                                      ...member,
                                      display:
                                        member?.display?.indexOf(":") > -1
                                          ? member?.display?.split(":")[1]
                                          : member?.display,
                                      selectionOptions:
                                        member?.hiNormal && member?.lowNormal
                                          ? generateSelectionOptions(
                                              member?.lowNormal,
                                              member?.hiNormal
                                            )
                                          : [],
                                    };
                                  }
                                ),
                          keyedAnswers: _.keyBy(
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.answers,
                            "uuid"
                          ),
                        },
                      },
                      firstSignOff: false,
                      secondSignOff: false,
                      collected: true,
                      collectedBy: {
                        display: sample?.creator?.display?.split(" (")[0],
                        name: sample?.creator?.display?.split(" (")[0],
                        uid: sample?.creator?.uuid,
                      },
                      accepted:
                        (
                          _.filter(sample?.statuses, { status: "ACCEPTED" }) ||
                          []
                        )?.length > 0
                          ? true
                          : false,
                      acceptedBy: formatUserChangedStatus(
                        (_.filter(sample?.statuses, {
                          status: "ACCEPTED",
                        }) || [])[0]
                      ),
                      containerDetails:
                        testContainers &&
                        testContainers[order?.order?.concept?.uuid]
                          ? testContainers[order?.order?.concept?.uuid]
                          : null,
                      allocationStatuses: allocationStatuses,
                      testAllocations: _.uniqBy(
                        _.map(
                          mergeTestAllocations(order?.testAllocations),
                          (allocation) => {
                            const authorizationStatus = _.orderBy(
                              allocation?.statuses?.filter(
                                (status) =>
                                  status?.status == "APPROVED" ||
                                  status?.category == "APPROVED"
                              ) || [],
                              ["timestamp"],
                              ["desc"]
                            )[0];
                            return {
                              ...allocation,
                              parameterUuid: allocation?.concept?.uuid,
                              authorizationInfo:
                                authorizationStatus?.status === "AUTHORIZED" ||
                                authorizationStatus?.status === "APPROVED"
                                  ? authorizationStatus
                                  : null,
                              firstSignOff:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "APPROVED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.status == "AUTHORIZED")
                                  ? true
                                  : false,
                              secondSignOff:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "AUTHORIZED"
                                  ? true
                                  : false,
                              rejected:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.category == "REJECTED")
                                  ? true
                                  : false,
                              rejectionStatus:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED"
                                  ? _.orderBy(
                                      allocation?.statuses,
                                      ["timestamp"],
                                      ["desc"]
                                    )[0]
                                  : null,
                              results: formatResults(allocation?.results),
                              statuses: allocation?.statuses,
                              resultsCommentsStatuses:
                                getResultsCommentsStatuses(
                                  allocation?.statuses
                                ),
                              allocationUuid: allocation?.uuid,
                            };
                          }
                        ),
                        "parameterUuid"
                      ),
                      allocationsGroupedByParameterUuid: _.groupBy(
                        _.map(order?.testAllocations, (allocation) => {
                          const authorizationStatus = _.orderBy(
                            allocation?.statuses,
                            ["timestamp"],
                            ["desc"]
                          )[0];
                          if (allocation?.results?.length > 0) {
                            return {
                              ...allocation,
                              parameterUuid: allocation?.concept?.uuid,
                              authorizationInfo:
                                authorizationStatus?.status === "APPROVED" ||
                                authorizationStatus?.status === "AUTHORIZED"
                                  ? authorizationStatus
                                  : null,
                              firstSignOff:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "APPROVED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.status == "AUTHORIZED")
                                  ? true
                                  : false,
                              secondSignOff:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "AUTHORIZED"
                                  ? true
                                  : false,
                              rejected:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.category == "REJECTED")
                                  ? true
                                  : false,
                              rejectionStatus:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED"
                                  ? _.orderBy(
                                      allocation?.statuses,
                                      ["timestamp"],
                                      ["desc"]
                                    )[0]
                                  : null,
                              results: formatResults(allocation?.results),
                              statuses: allocation?.statuses,
                              resultsCommentsStatuses:
                                getResultsCommentsStatuses(
                                  allocation?.statuses
                                ),
                              allocationUuid: allocation?.uuid,
                            };
                          }
                        })?.filter((alloc) => alloc),
                        "parameterUuid"
                      ),
                    };
                    // console.log(formattedOrder);
                    return formattedOrder;
                  }),
                  searchingText: createSearchingText(sample),
                  priorityStatus: (sample?.statuses?.filter(
                    (status) => status?.remarks === "PRIORITY"
                  ) || [])[0],
                  disposedStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "DISPOSED" ||
                      status?.status === "DISPOSED"
                  ) || [])[0],
                  receivedOnStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "RECEIVED_ON" ||
                      status?.status === "RECEIVED_ON"
                  ) || [])[0],
                  deliveredByStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "DELIVERED_BY" ||
                      status?.status === "DELIVERED_BY"
                  ) || [])[0],

                  receivedByStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "RECEIVED_BY" ||
                      status?.status === "RECEIVED_BY"
                  ) || [])[0],
                  priorityHigh:
                    (
                      sample?.statuses?.filter(
                        (status) =>
                          status?.status === "HIGH" ||
                          status?.status === "Urgent"
                      ) || []
                    )?.length > 0
                      ? true
                      : false,
                  priorityOrderNumber:
                    (
                      sample?.statuses?.filter(
                        (status) =>
                          status?.status === "HIGH" ||
                          status?.status === "Urgent"
                      ) || []
                    )?.length > 0
                      ? 0
                      : 1,
                  configs: action?.configs,
                };
              });
              return addLoadedSample({ sample: samples[0] });
            })
          );
        }
      )
    )
  );

  labSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLabSamplesByCollectionDates),
      withLatestFrom(this.store.select(getLISConfigurations)),
      switchMap(([action, lisConfigs]: [any, any]) => {
        return this.sampleService
          .getLabSamplesByCollectionDates(
            action.datesParameters,
            action?.category,
            action?.hasStatus,
            action.excludeAllocations
          )
          .pipe(
            map((response) => {
              const keyedDepartments = keyDepartmentsByTestOrder(
                action.departments
              );
              const keyedSpecimenSources = keySampleTypesByTestOrder(
                action.sampleTypes
              );
              const samples = _.map(response, (sample) => {
                const rejectionStatuses =
                  sample?.statuses?.filter(
                    (status) => status?.category?.indexOf("REJECTED") > -1
                  ) || [];
                return {
                  ...sample,
                  id: sample?.label,
                  specimen:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedSpecimenSources[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]
                      : null,
                  mrn: sample?.patient?.identifiers[0]?.id,
                  department:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedDepartments[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]
                      : null,
                  collected: true,
                  integrationStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "RESULTS_INTEGRATION"
                  ) || [])[0],
                  releasedStatuses: (
                    sample?.statuses?.filter(
                      (status) => status?.status === "RELEASED"
                    ) || []
                  ).map((status) => {
                    return {
                      ...status,
                      date:
                        new Date(status?.timestamp).toLocaleDateString() +
                        " " +
                        new Date(status?.timestamp).getHours().toString() +
                        ":" +
                        new Date(status?.timestamp).getMinutes().toString() +
                        " ( " +
                        moment(Number(status?.timestamp)).fromNow() +
                        " )",
                    };
                  }),
                  restrictedStatuses: (
                    sample?.statuses?.filter(
                      (status) => status?.status === "RESTRICTED"
                    ) || []
                  ).map((status) => {
                    return {
                      ...status,
                      date:
                        new Date(status?.timestamp).toLocaleDateString() +
                        " " +
                        new Date(status?.timestamp).getHours().toString() +
                        ":" +
                        new Date(status?.timestamp).getMinutes().toString() +
                        " ( " +
                        moment(Number(status?.timestamp)).fromNow() +
                        " )",
                    };
                  }),
                  reasonsForRejection:
                    rejectionStatuses?.length > 0
                      ? rejectionStatuses?.map((status) => {
                          return {
                            uuid: status?.status,
                            display:
                              (action.codedSampleRejectionReasons?.filter(
                                (reason) => reason?.uuid === status?.status
                              ) || [])[0]?.display,
                          };
                        })
                      : null,
                  markedForRecollection:
                    sample?.statuses?.length > 0 &&
                    (_.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                      ?.status == "RECOLLECT" ||
                      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                        ?.category == "RECOLLECT")
                      ? true
                      : false,
                  rejected: rejectionStatuses?.length > 0 ? true : false,
                  rejectedBy:
                    rejectionStatuses?.length > 0
                      ? {
                          ...{
                            ...rejectionStatuses[0]?.user,
                            name: rejectionStatuses[0]?.user?.name?.split(
                              " ("
                            )[0],
                          },
                          ...rejectionStatuses[0],
                        }
                      : null,
                  departmentName:
                    sample && sample?.orders?.length > 0 && sample?.orders[0]
                      ? keyedDepartments[
                          sample?.orders[0]?.order?.concept?.uuid
                        ]?.departmentName
                      : null,
                  collectedBy: {
                    display: sample?.creator?.display?.split(" (")[0],
                    name: sample?.creator?.display?.split(" (")[0],
                    uid: sample?.creator?.uuid,
                  },
                  collectedByStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "COLLECTED_BY"
                  ) || [])[0],
                  collectedOnStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "COLLECTED_ON"
                  ) || [])[0],
                  acceptanceRemarksStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "ACCEPTANCE_REMARKS"
                  ) || [])[0],
                  broughtOnStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "DELIVERED_ON"
                  ) || [])[0],
                  registeredBy: {
                    display: sample?.creator?.display?.split(" (")[0],
                    name: sample?.creator?.display?.split(" (")[0],
                    uid: sample?.creator?.uuid,
                  },
                  sampleConditionStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "CONDITION"
                  ) || [])[0],
                  sampleTransportConditionStatus: (sample?.statuses?.filter(
                    (status) => status?.category === "TRANSPORT_CONDITION"
                  ) || [])[0],
                  sampleTransportationTemperatureStatus:
                    (sample?.statuses?.filter(
                      (status) => status?.category === "TRANSPORT_TEMPERATURE"
                    ) || [])[0],
                  ordersWithResults: getOrdersWithResults(sample?.orders),
                  disposed:
                    (_.filter(sample?.statuses, { status: "DISPOSED" }) || [])
                      ?.length > 0
                      ? true
                      : false,
                  disposedAt: (_.filter(sample?.statuses, {
                    status: "DISPOSED",
                  }) || [])[0]?.timestamp,
                  disposedBy: formatUserChangedStatus(
                    (_.filter(sample?.statuses, {
                      status: "DISPOSED",
                    }) || [])[0]
                  ),
                  accepted:
                    (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])
                      ?.length > 0
                      ? true
                      : false,
                  acceptedBy: formatUserChangedStatus(
                    (_.filter(sample?.statuses, {
                      status: "ACCEPTED",
                    }) || [])[0]
                  ),
                  authorizationInfo: getAuthorizationDetails(sample),
                  acceptedAt: (_.filter(sample?.statuses, {
                    status: "ACCEPTED",
                  }) || [])[0]?.timestamp,
                  orders: _.map(sample?.orders, (order) => {
                    const allocationStatuses = _.flatten(
                      order?.testAllocations?.map((allocation) => {
                        return allocation?.statuses;
                      })
                    );
                    const formattedOrder = {
                      ...order,
                      authorizationInfo: getAuthorizationDetailsByOrder(order),
                      searchingText:
                        order?.order?.concept?.display?.toLowerCase() +
                        " " +
                        (
                          keyedSpecimenSources[
                            order?.order?.concept?.uuid
                          ]?.setMembers?.map((member) =>
                            member?.display?.toLowerCase()
                          ) || []
                        )?.join(" "),
                      order: {
                        ...order?.order,
                        concept: {
                          ...order?.order?.concept,
                          ...keyedSpecimenSources[order?.order?.concept?.uuid],
                          uuid: order?.order?.concept?.uuid,
                          display:
                            order?.order?.concept?.display?.indexOf(":") > -1
                              ? order?.order?.concept?.display?.split(":")[1]
                              : order?.order?.concept?.display,
                          selectionOptions:
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.hiNormal &&
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.lowNormal
                              ? generateSelectionOptions(
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.lowNormal,
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.hiNormal
                                )
                              : [],
                          setMembers:
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.setMembers?.length == 0
                              ? []
                              : _.map(
                                  keyedSpecimenSources[
                                    order?.order?.concept?.uuid
                                  ]?.setMembers,
                                  (member) => {
                                    return {
                                      ...member,
                                      display:
                                        member?.display?.indexOf(":") > -1
                                          ? member?.display?.split(":")[1]
                                          : member?.display,
                                      selectionOptions:
                                        member?.hiNormal && member?.lowNormal
                                          ? generateSelectionOptions(
                                              member?.lowNormal,
                                              member?.hiNormal
                                            )
                                          : [],
                                    };
                                  }
                                ),
                          keyedAnswers: _.keyBy(
                            keyedSpecimenSources[order?.order?.concept?.uuid]
                              ?.answers,
                            "uuid"
                          ),
                        },
                      },
                      firstSignOff:
                        (
                          mergeTestAllocations(order?.testAllocations)?.filter(
                            (allocation) =>
                              (
                                allocation?.statuses?.filter(
                                  (status) =>
                                    status?.status === "APPROVED" ||
                                    status?.status === "AUTHORIZED"
                                ) || []
                              )?.length > 0
                          ) || []
                        )?.length > 0,
                      secondSignOff:
                        (
                          mergeTestAllocations(order?.testAllocations)?.filter(
                            (allocation) =>
                              (
                                allocation?.statuses?.filter(
                                  (status) => status?.status === "AUTHORIZED"
                                ) || []
                              )?.length > 0
                          ) || []
                        )?.length > 0,
                      collected: true,
                      collectedBy: {
                        display: sample?.creator?.display?.split(" (")[0],
                        name: sample?.creator?.display?.split(" (")[0],
                        uid: sample?.creator?.uuid,
                      },
                      accepted:
                        (
                          _.filter(sample?.statuses, { status: "ACCEPTED" }) ||
                          []
                        )?.length > 0
                          ? true
                          : false,
                      acceptedBy: formatUserChangedStatus(
                        (_.filter(sample?.statuses, {
                          status: "ACCEPTED",
                        }) || [])[0]
                      ),
                      containerDetails: action.containers[
                        order?.order?.concept?.uuid
                      ]
                        ? action.containers[order?.order?.concept?.uuid]
                        : null,
                      allocationStatuses: allocationStatuses,
                      testAllocations: _.uniqBy(
                        _.map(
                          mergeTestAllocations(order?.testAllocations),
                          (allocation) => {
                            const authorizationStatus = _.orderBy(
                              allocation?.statuses?.filter(
                                (status) =>
                                  status?.status == "APPROVED" ||
                                  status?.status == "AUTHORIZED"
                              ) || [],
                              ["timestamp"],
                              ["desc"]
                            )[0];
                            return {
                              ...allocation,
                              parameterUuid: allocation?.concept?.uuid,
                              authorizationInfo:
                                authorizationStatus?.status === "APPROVED" ||
                                authorizationStatus?.status === "AUTHORIZED"
                                  ? authorizationStatus
                                  : null,
                              firstSignOff:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "APPROVED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.status == "AUTHORIZED")
                                  ? true
                                  : false,
                              secondSignOff:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "AUTHORIZED"
                                  ? true
                                  : false,
                              rejected:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.category == "REJECTED")
                                  ? true
                                  : false,
                              rejectionStatus:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED"
                                  ? _.orderBy(
                                      allocation?.statuses,
                                      ["timestamp"],
                                      ["desc"]
                                    )[0]
                                  : null,
                              results: formatResults(allocation?.results),
                              statuses: allocation?.statuses,
                              resultsCommentsStatuses:
                                getResultsCommentsStatuses(
                                  allocation?.statuses
                                ),
                              allocationUuid: allocation?.uuid,
                            };
                          }
                        ),
                        "parameterUuid"
                      ),
                      allocationsGroupedByParameterUuid: _.groupBy(
                        _.map(order?.testAllocations, (allocation) => {
                          const authorizationStatus = _.orderBy(
                            allocation?.statuses,
                            ["timestamp"],
                            ["desc"]
                          )[0];
                          if (allocation?.results?.length > 0) {
                            return {
                              ...allocation,
                              parameterUuid: allocation?.concept?.uuid,
                              authorizationInfo:
                                authorizationStatus?.status === "APPROVED" ||
                                authorizationStatus?.category === "APPROVED"
                                  ? authorizationStatus
                                  : null,
                              firstSignOff:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "APPROVED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.status == "AUTHORIZED")
                                  ? true
                                  : false,
                              secondSignOff:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "AUTHORIZED"
                                  ? true
                                  : false,
                              rejected:
                                allocation?.statuses?.length > 0 &&
                                (_.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED" ||
                                  _.orderBy(
                                    allocation?.statuses,
                                    ["timestamp"],
                                    ["desc"]
                                  )[0]?.category == "REJECTED")
                                  ? true
                                  : false,
                              rejectionStatus:
                                allocation?.statuses?.length > 0 &&
                                _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]?.status == "REJECTED"
                                  ? _.orderBy(
                                      allocation?.statuses,
                                      ["timestamp"],
                                      ["desc"]
                                    )[0]
                                  : null,
                              results: formatResults(allocation?.results),
                              statuses: allocation?.statuses,
                              resultsCommentsStatuses:
                                getResultsCommentsStatuses(
                                  allocation?.statuses
                                ),
                              allocationUuid: allocation?.uuid,
                            };
                          }
                        })?.filter((alloc) => alloc),
                        "parameterUuid"
                      ),
                    };
                    // console.log(formattedOrder);
                    return formattedOrder;
                  }),
                  searchingText: createSearchingText(sample),
                  priorityStatus: (sample?.statuses?.filter(
                    (status) => status?.remarks === "PRIORITY"
                  ) || [])[0],
                  receivedOnStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "RECEIVED_ON" ||
                      status?.status === "RECEIVED_ON"
                  ) || [])[0],
                  deliveredByStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "DELIVERED_BY" ||
                      status?.status === "DELIVERED_BY"
                  ) || [])[0],

                  receivedByStatus: (sample?.statuses?.filter(
                    (status) =>
                      status?.category === "RECEIVED_BY" ||
                      status?.status === "RECEIVED_BY"
                  ) || [])[0],
                  priorityHigh:
                    (
                      sample?.statuses?.filter(
                        (status) =>
                          status?.status === "HIGH" ||
                          status?.status === "Urgent"
                      ) || []
                    )?.length > 0
                      ? true
                      : false,
                  priorityOrderNumber:
                    (
                      sample?.statuses?.filter(
                        (status) =>
                          status?.status === "HIGH" ||
                          status?.status === "Urgent"
                      ) || []
                    )?.length > 0
                      ? 0
                      : 1,
                  configs: action?.configs,
                };
              });
              return addFormattedLabSamples({ samples });
            })
          );
      })
    )
  );

  patientLabSamples$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLabSamplesByVisit),
      switchMap((action) => {
        return this.sampleService.getSampleByVisit(action.visit).pipe(
          map((response) => {
            const keyedDepartments = keyDepartmentsByTestOrder(
              action.departments
            );

            const keyedSpecimenSources = keySampleTypesByTestOrder(
              action.sampleTypes
            );
            const samples = _.map(response, (sample) => {
              return {
                ...sample,
                id: sample?.label,
                specimen: (_.filter(action.sampleTypes, {
                  id: sample?.concept?.uuid,
                }) || [])[0],
                mrn: sample?.patient?.identifiers[0]?.id,
                department:
                  sample && sample?.orders?.length > 0 && sample?.orders[0]
                    ? keyedDepartments[sample?.orders[0]?.order?.concept?.uuid]
                    : null,
                collected: true,
                reasonForRejection:
                  sample?.statuses?.length > 0 &&
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "REJECTED"
                    ? (action.codedSampleRejectionReasons.filter(
                        (reason) =>
                          reason.uuid ===
                          _.orderBy(
                            sample?.statuses,
                            ["timestamp"],
                            ["desc"]
                          )[0]?.remarks
                      ) || [])[0]
                    : sample?.statuses?.length > 0 &&
                      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                        ?.status == "RECOLLECT"
                    ? (action.codedSampleRejectionReasons.filter(
                        (reason) =>
                          reason.uuid ===
                          _.orderBy(
                            sample?.statuses,
                            ["timestamp"],
                            ["desc"]
                          )[1]?.remarks
                      ) || [])[0]
                    : null,
                markedForRecollection:
                  sample?.statuses?.length > 0 &&
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "RECOLLECT"
                    ? true
                    : false,
                rejected:
                  sample?.statuses?.length > 0 &&
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "REJECTED"
                    ? true
                    : false,
                rejectedBy:
                  sample?.statuses?.length > 0 &&
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "REJECTED"
                    ? _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                        ?.user
                    : null,
                departmentName:
                  sample && sample?.orders?.length > 0 && sample?.orders[0]
                    ? keyedDepartments[sample?.orders[0]?.order?.concept?.uuid]
                        ?.departmentName
                    : null,
                collectedBy: {
                  display: sample?.creator?.display?.split(" (")[0],
                  name: sample?.creator?.display?.split(" (")[0],
                  uid: sample?.creator?.uuid,
                },
                accepted:
                  (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])
                    ?.length > 0
                    ? true
                    : false,
                acceptedBy: formatUserChangedStatus(
                  (_.filter(sample?.statuses, {
                    status: "ACCEPTED",
                  }) || [])[0]
                ),
                acceptedAt: (_.filter(sample?.statuses, {
                  status: "ACCEPTED",
                }) || [])[0]?.timestamp,
                orders: _.map(sample?.orders, (order) => {
                  return {
                    ...order,
                    order: {
                      ...order?.order,
                      concept: {
                        ...order?.order?.concept,
                        ...keyedSpecimenSources[order?.order?.concept?.uuid],
                        uuid: order?.order?.concept?.uuid,
                        display: order?.order?.concept?.display,
                        selectionOptions:
                          keyedSpecimenSources[order?.order?.concept?.uuid]
                            ?.hiNormal &&
                          keyedSpecimenSources[order?.order?.concept?.uuid]
                            ?.lowNormal
                            ? generateSelectionOptions(
                                keyedSpecimenSources[
                                  order?.order?.concept?.uuid
                                ]?.lowNormal,
                                keyedSpecimenSources[
                                  order?.order?.concept?.uuid
                                ]?.hiNormal
                              )
                            : [],
                        setMembers:
                          keyedSpecimenSources[order?.order?.concept?.uuid]
                            ?.setMembers?.length == 0
                            ? []
                            : _.map(
                                keyedSpecimenSources[
                                  order?.order?.concept?.uuid
                                ]?.setMembers,
                                (member) => {
                                  return {
                                    ...member,
                                    selectionOptions:
                                      member?.hiNormal && member?.lowNormal
                                        ? generateSelectionOptions(
                                            member?.lowNormal,
                                            member?.hiNormal
                                          )
                                        : [],
                                  };
                                }
                              ),
                        keyedAnswers: _.keyBy(
                          keyedSpecimenSources[order?.order?.concept?.uuid]
                            ?.answers,
                          "uuid"
                        ),
                      },
                    },
                    firstSignOff: false,
                    secondSignOff: false,
                    collected: true,
                    collectedBy: {
                      display: sample?.creator?.display?.split(" (")[0],
                      name: sample?.creator?.display?.split(" (")[0],
                      uid: sample?.creator?.uuid,
                    },
                    accepted:
                      (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])
                        ?.length > 0
                        ? true
                        : false,
                    acceptedBy: formatUserChangedStatus(
                      (_.filter(sample?.statuses, {
                        status: "ACCEPTED",
                      }) || [])[0]
                    ),
                    containerDetails: action.containers[
                      order?.order?.concept?.uuid
                    ]
                      ? action.containers[order?.order?.concept?.uuid]
                      : null,
                    testAllocations: _.map(
                      order?.testAllocations,
                      (allocation) => {
                        return {
                          ...allocation,
                          firstSignOff:
                            allocation?.statuses?.length > 0 &&
                            (_.orderBy(
                              allocation?.statuses,
                              ["timestamp"],
                              ["desc"]
                            )[0]?.status == "APPROVED" ||
                              _.orderBy(
                                allocation?.statuses,
                                ["timestamp"],
                                ["desc"]
                              )[0]?.status == "AUTHORIZED")
                              ? true
                              : false,
                          secondSignOff:
                            allocation?.statuses?.length > 0 &&
                            _.orderBy(
                              allocation?.statuses,
                              ["timestamp"],
                              ["desc"]
                            )[0]?.status == "AUTHORIZED"
                              ? true
                              : false,
                          rejected:
                            allocation?.statuses?.length > 0 &&
                            _.orderBy(
                              allocation?.statuses,
                              ["timestamp"],
                              ["desc"]
                            )[0]?.status == "REJECTED"
                              ? true
                              : false,
                          rejectionStatus:
                            allocation?.statuses?.length > 0 &&
                            _.orderBy(
                              allocation?.statuses,
                              ["timestamp"],
                              ["desc"]
                            )[0]?.status == "REJECTED"
                              ? _.orderBy(
                                  allocation?.statuses,
                                  ["timestamp"],
                                  ["desc"]
                                )[0]
                              : null,
                          results: formatResults(allocation?.results),
                          statuses: allocation?.statuses,
                          resultsCommentsStatuses: getResultsCommentsStatuses(
                            allocation?.statuses
                          ),
                          allocationUuid: allocation?.uuid,
                        };
                      }
                    ),
                  };
                }),
                searchingText: createSearchingText(sample),
                priorityHigh:
                  (
                    sample?.statuses?.filter(
                      (status) =>
                        status?.status === "HIGH" || status?.status === "Urgent"
                    ) || []
                  )?.length > 0
                    ? true
                    : false,
                priorityOrderNumber:
                  (
                    sample?.statuses?.filter(
                      (status) =>
                        status?.status === "HIGH" || status?.status === "Urgent"
                    ) || []
                  )?.length > 0
                    ? 0
                    : 1,
                configs: action?.configs,
              };
            });
            return addFormattedLabSamples({ samples });
          })
        );
      })
    )
  );

  sampleCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectSample),
      withLatestFrom(this.store.select(getCurrentUserDetails)),
      map(([action, currentUser]: [any, any]) => {
        return [action, currentUser];
      }),
      switchMap(([action, provider]: [any, any]) => {
        return this.sampleService.collectSample(action.sampleData).pipe(
          mergeMap((response) => {
            const formattedSample = {
              ...action?.details,
              sampleIdentifier: response?.label,
              sampleCollectionDate: new Date().getTime(),
              collected: true,
              accepted: false,
              rejected: false,
              collectedBy: {
                name: provider?.display,
                uuid: provider?.uuid,
              },
              reCollect: false,
              priorityHigh:
                action?.priorityDetails &&
                action?.priorityDetails?.status &&
                (action?.priorityDetails?.status == "HIGH" ||
                  action?.priorityDetails?.status == "Urgent")
                  ? true
                  : false,
              collectedAt: new Date(),
              sampleUuid: response?.uuid,
              orders: _.map(action?.details?.orders, (order) => {
                return {
                  ...order,
                  collected: true,
                  sampleUuid: response?.uuid,
                  sampleIdentifier: response?.label,
                  priorityHigh:
                    action?.priorityDetails &&
                    action?.priorityDetails?.status &&
                    (action?.priorityDetails?.status === "HIGH" ||
                      action?.priorityDetails?.status === "Urgent")
                      ? true
                      : false,
                  collectedAt: new Date(),
                  collectedBy: {
                    name: provider?.display,
                    uuid: provider?.uuid,
                  },
                };
              }),
            };

            /**
             * TODO: improve implementation for taking priority data
             */
            const status =
              action?.priorityDetails && action?.priorityDetails?.status
                ? {
                    sample: {
                      uuid: response?.uuid,
                    },
                    user: action?.priorityDetails?.user,
                    remarks: "high priority",
                    category: "PRIORITY",
                    status: "Urgent",
                  }
                : null;
            const statuses = [
              status,
              {
                sample: {
                  uuid: response?.uuid,
                },
                user: {
                  uuid: localStorage.getItem("userUuid"),
                },
                remarks: "Sample collection",
                category: "COLLECTED",
                status: "COLLECTED",
              },
            ]?.filter((status) => status);
            if (statuses?.length > 0) {
              return [
                setSampleStatuses({ statuses: statuses }),
                updateLabSample({ sample: formattedSample }),
                markSampleCollected({ sample: formattedSample }),
                removeCollectedSampleFromSamplesToCollect({
                  referenceId: formattedSample?.departmentSpecimentSource,
                }),
              ];
            } else {
              return [
                updateLabSample({ sample: formattedSample }),
                markSampleCollected({ sample: formattedSample }),
                removeCollectedSampleFromSamplesToCollect({
                  referenceId: formattedSample?.departmentSpecimentSource,
                }),
              ];
            }
          }),
          catchError((error) => of(creatingSampleFails({ error })))
        );
      })
    )
  );

  acceptSample$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptSample),
      withLatestFrom(this.store.select(getProviderDetails)),
      switchMap(([action, provider]: [any, any]) => {
        let formattedSample: any = {};
        if (
          !action?.status?.status ||
          (action?.status?.status &&
            (action?.status?.status !== "HIGH" ||
              action?.status?.status !== "Urgent")) ||
          action?.status?.status !== "RECOLLECT"
        ) {
          formattedSample = {
            ...action?.details,
            collected: true,
            accepted: action?.status?.status == "ACCEPTED" ? true : false,
            rejected: action?.status?.status == "REJECTED" ? true : false,
            acceptedAt:
              action?.status?.status == "ACCEPTED"
                ? new Date().getTime()
                : null,
            rejectedAt:
              action?.status?.status == "REJECTED"
                ? new Date().getTime()
                : null,
            rejectionReason: action.details?.rejectionReason,
            acceptedBy: null,
            rejectedBy: null,
            orders: _.map(action?.details?.orders, (order) => {
              return {
                ...order,
                collected: true,
                accepted: action?.status?.status == "ACCEPTED" ? true : false,
                rejected: action?.status?.status == "REJECTED" ? true : false,
                acceptedBy: null,
                rejectedBy: null,
                testAllocations: [],
              };
            }),
          };
        } else {
          formattedSample = {
            ...action?.details,
            collected: true,
            priorityHigh: true,
            reCollectionSetBy: null,
            prioritySetBy: null,
            markedForRecollection:
              action?.status?.status == "RECOLLECT" ? true : false,
            orders: _.map(action?.details?.orders, (order) => {
              return {
                ...order,
                priorityHigh: true,
                reCollect: action?.status?.status == "RECOLLECT" ? true : false,
                testAllocations: [],
              };
            }),
          };
        }

        let orders = formattedSample?.orders;
        let configs = formattedSample?.configs;

        let newOrdersForReference = [];
        let allocations = [];
        _.each(orders, (order) => {
          if (order?.order?.concept?.setMembers?.length === 0) {
            newOrdersForReference = [...newOrdersForReference, order];
            allocations = [
              ...allocations,
              {
                order: {
                  uuid: order?.order?.uuid,
                },
                container: {
                  uuid: order?.containerDetails
                    ? order?.containerDetails?.uuid
                    : configs["otherContainer"]?.uuid,
                },
                sample: {
                  uuid: order?.sample?.uuid,
                },
                concept: {
                  uuid: order?.order?.concept?.uuid,
                },
                label: order?.order?.orderNumber,
              },
            ];
          } else {
            _.each(order?.order?.concept?.setMembers, (setMember) => {
              newOrdersForReference = [...newOrdersForReference, order];
              allocations = [
                ...allocations,
                {
                  order: {
                    uuid: order?.order?.uuid,
                  },
                  container: {
                    uuid: order?.containerDetails
                      ? order?.containerDetails?.uuid
                      : configs["otherContainer"]?.uuid,
                  },
                  sample: {
                    uuid: order?.sample?.uuid,
                  },
                  concept: {
                    uuid: setMember?.uuid,
                  },
                  label: order?.order?.orderNumber,
                },
              ];
            });
          }
        });

        let sampleAcceptStatusWithAllocations = {
          status: action?.status,
          allocations: allocations,
        };

        return this.sampleService
          .acceptSampleAndCreateAllocations(sampleAcceptStatusWithAllocations)
          .pipe(
            mergeMap((response) => {
              let reprocessedOrders = _.map(
                action?.details?.orders,
                (order) => {
                  return {
                    ...order,
                    collected: true,
                    accepted:
                      action?.status?.status == "ACCEPTED" ? true : false,
                    rejected:
                      action?.status?.status == "REJECTED" ? true : false,
                    acceptedBy:
                      action?.status?.status == "ACCEPTED"
                        ? {
                            name: response?.status?.user?.name.split("(")[0],
                            uuid: response?.status?.user?.uuid,
                          }
                        : null,
                    rejectedBy:
                      action?.status?.status == "REJECTED"
                        ? {
                            name: response?.status?.user?.name.split("(")[0],
                            uuid: response?.status?.user?.uuid,
                          }
                        : null,
                  };
                }
              );

              formattedSample = {
                ...formattedSample,
                reCollectionSetBy:
                  action?.status?.status == "RECOLLECT"
                    ? formatUserChangedStatus(response?.status)
                    : null,
                prioritySetBy:
                  action?.status?.status == "HIGH"
                    ? formatUserChangedStatus(response?.status)
                    : null,
                acceptedBy:
                  action?.status?.status == "ACCEPTED"
                    ? formatUserChangedStatus(response?.status)
                    : null,
                rejectedBy:
                  action?.status?.status == "REJECTED"
                    ? formatUserChangedStatus(response?.status)
                    : null,
                orders: formatAllocationResponsesByOrdersAfterAcceptingSample(
                  _.map(response?.allocations, (allocation) => {
                    let orderObject = _.filter(reprocessedOrders, (order) => {
                      return allocation?.label == order?.order?.orderNumber
                        ? true
                        : false;
                    });

                    let orderObjectToSpread =
                      orderObject?.length > 0 ? orderObject[0] : {};

                    return {
                      ...orderObjectToSpread,
                      allocations: [
                        {
                          ...allocation,
                          allocationUuid: allocation?.uuid,
                          results: [],
                        },
                      ],
                    };
                  }),
                  reprocessedOrders
                ),
              };

              return [updateLabSample({ sample: formattedSample })];
            })
          );
      })
    )
  );

  setSampleStatuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSampleStatuses),
      withLatestFrom(this.store.select(getProviderDetails)),
      switchMap(([action, provider]: [any, any]) => {
        return this.sampleService.saveSampleStatuses(action.statuses).pipe(
          mergeMap((response) => {
            let formattedSample: any = {};
            formattedSample = {
              ...action?.details,
              collected: true,
              accepted: action?.status?.status == "ACCEPTED" ? true : false,
              rejected: action?.status?.status == "REJECTED" ? true : false,
              acceptedAt:
                action?.status?.status == "ACCEPTED"
                  ? new Date().getTime()
                  : null,
              rejectedAt:
                action?.status?.status == "REJECTED"
                  ? new Date().getTime()
                  : null,
              rejectionReason: action.details?.rejectionReason,
              acceptedBy:
                action?.status?.status == "ACCEPTED"
                  ? formatUserChangedStatus(response[0])
                  : null,
              rejectedBy:
                action?.status?.status == "REJECTED"
                  ? formatUserChangedStatus(response[0])
                  : null,
              orders: _.map(action?.details?.orders, (order) => {
                return {
                  ...order,
                  collected: true,
                  accepted: action?.status?.status == "ACCEPTED" ? true : false,
                  rejected: action?.status?.status == "REJECTED" ? true : false,
                  acceptedBy:
                    action?.status?.status == "ACCEPTED"
                      ? {
                          name: response[0]?.user?.name.split("(")[0],
                          uuid: response[0]?.user?.uuid,
                        }
                      : null,
                  rejectedBy:
                    action?.status?.status == "REJECTED"
                      ? {
                          name: response[0]?.user?.name.split("(")[0],
                          uuid: response[0]?.user?.uuid,
                        }
                      : null,
                  testAllocations: [],
                };
              }),
            };
            return [updateLabSample({ sample: formattedSample })];
          })
        );
      })
    )
  );

  setSampleStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSampleStatus),
      withLatestFrom(this.store.select(getProviderDetails)),
      switchMap(([action, provider]: [any, any]) => {
        return this.sampleService.setSampleStatus(action.status).pipe(
          mergeMap((response) => {
            let formattedSample: any = {};
            if (
              !action?.status?.status ||
              (action?.status?.status &&
                (action?.status?.status !== "HIGH" ||
                  action?.status?.status !== "Urgent")) ||
              action?.status?.status !== "RECOLLECT"
            ) {
              formattedSample = {
                ...action?.details,
                collected: true,
                accepted: action?.status?.status == "ACCEPTED" ? true : false,
                rejected: action?.status?.status == "REJECTED" ? true : false,
                acceptedAt:
                  action?.status?.status == "ACCEPTED"
                    ? new Date().getTime()
                    : null,
                rejectedAt:
                  action?.status?.status == "REJECTED"
                    ? new Date().getTime()
                    : null,
                rejectionReason: action.details?.rejectionReason,
                acceptedBy:
                  action?.status?.status == "ACCEPTED"
                    ? formatUserChangedStatus(response)
                    : null,
                rejectedBy:
                  action?.status?.status == "REJECTED"
                    ? formatUserChangedStatus(response)
                    : null,
                orders: _.map(action?.details?.orders, (order) => {
                  return {
                    ...order,
                    collected: true,
                    accepted:
                      action?.status?.status == "ACCEPTED" ? true : false,
                    rejected:
                      action?.status?.status == "REJECTED" ? true : false,
                    acceptedBy:
                      action?.status?.status == "ACCEPTED"
                        ? {
                            name: response?.user?.name.split("(")[0],
                            uuid: response?.user?.uuid,
                          }
                        : null,
                    rejectedBy:
                      action?.status?.status == "REJECTED"
                        ? {
                            name: response?.user?.name.split("(")[0],
                            uuid: response?.user?.uuid,
                          }
                        : null,
                    testAllocations: [],
                  };
                }),
              };
            } else {
              formattedSample = {
                ...action?.details,
                sampleIdentifier: response?.sample?.label,
                collected: true,
                priorityHigh: true,
                reCollectionSetBy:
                  action?.status?.status == "RECOLLECT"
                    ? formatUserChangedStatus(response)
                    : null,
                prioritySetBy:
                  action?.status?.status == "HIGH" ||
                  action?.status?.status == "Urgent"
                    ? formatUserChangedStatus(response)
                    : null,
                markedForRecollection:
                  action?.status?.status == "RECOLLECT" ? true : false,
                orders: _.map(action?.details?.orders, (order) => {
                  return {
                    ...order,
                    priorityHigh: true,
                    reCollect:
                      action?.status?.status == "RECOLLECT" ? true : false,
                    testAllocations: [],
                  };
                }),
              };
            }
            if (
              action?.status?.status == "HIGH" ||
              action?.status?.status == "Urgent" ||
              action?.status?.status == "RECOLLECT"
            ) {
              return [updateLabSample({ sample: formattedSample })];
            } else {
              return [
                updateLabSample({ sample: formattedSample }),
                saveTestsContainerAllocation({
                  orders: formattedSample?.orders,
                  sampleDetails: formattedSample,
                }),
              ];
            }
          })
        );
      })
    )
  );

  testsAllocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveTestsContainerAllocation),
      withLatestFrom(this.store.select(getProviderDetails)),
      switchMap(([action, provider]: [any, any]) =>
        this.sampleService
          .saveTestContainerAllocation(
            action.orders,
            action.sampleDetails?.configs
          )
          .pipe(
            map((responses) => {
              let formattedSample = {
                ...action?.sampleDetails,
                orders: formatAllocationResponsesByOrdersAfterAcceptingSample(
                  responses,
                  action.orders
                ),
              };
              return updateLabSample({ sample: formattedSample });
            })
          )
      )
    )
  );

  testsResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveLabTestResults),
      switchMap((action) => {
        return (
          action.isResultAnArray
            ? this.sampleService.saveLabResults(action?.results)
            : this.sampleService.saveLabResult(action.results)
        ).pipe(
          mergeMap((response) => {
            // console.log("response", response);
            let formattedSample = {
              ...action?.sampleDetails,
              orders: _.map(action?.sampleDetails?.orders, (order) => {
                if (order?.order?.concept?.uuid == action?.concept?.uuid) {
                  return {
                    ...order,
                    testAllocations: formatTestsAllocations(
                      order,
                      action?.allocation,
                      response
                    ),
                  };
                } else {
                  return order;
                }
              }),
            };

            return [
              updateLabSample({ sample: formattedSample }),
              saveLabTestResultsStatus({
                resultsStatus: action?.comments,
                sampleDetails: formattedSample,
                concept: action?.concept,
                allocation: action?.allocation,
                isResultAnArray: action?.isResultAnArray,
              }),
            ];
          })
        );
      })
    )
  );

  testsResultsStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveLabTestResultsStatus),
      switchMap((action) =>
        (action.isResultAnArray
          ? this.sampleService.saveLabResultStatuses(action.resultsStatus)
          : this.sampleService.saveLabResultStatus(action.resultsStatus)
        ).pipe(
          mergeMap((response) => {
            // console.log("RES Statuses response", response);
            let formattedSample = {
              ...action?.sampleDetails,
              orders: _.map(action?.sampleDetails?.orders, (order) => {
                if (order?.order?.concept?.uuid == action?.concept?.uuid) {
                  return {
                    ...order,
                    testAllocations: formatTestAllocationsAfterApproval(
                      order,
                      action.allocation,
                      response
                    ),
                  };
                } else {
                  return order;
                }
              }),
            };
            // console.log('formattedSample for test status', formattedSample);
            return [updateLabSample({ sample: formattedSample })];
          })
        )
      )
    )
  );

  rejectionReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSampleRejectionCodedReasons),
      switchMap(() =>
        this.sampleTypesService.getCodedRejectionReasons().pipe(
          mergeMap((response) => {
            return [
              addSampleRejectionCodesReasons({
                codedSampleRejectionReasons: response,
              }),
            ];
          })
        )
      )
    )
  );
}

function mergeTestAllocations(allocations: any): any {
  const formattedTestAllocations = allocations?.map((allocation) => {
    return {
      ...allocation,
      parameterUuid: allocation?.concept?.uuid,
    };
  });
  const groupedAllocations = _.groupBy(
    formattedTestAllocations,
    "parameterUuid"
  );
  // console.log(groupedAllocations);
  const alls = Object.keys(groupedAllocations)?.map((key) => {
    const allocationWithResults = (groupedAllocations[key]?.filter(
      (allocation) => allocation?.results?.length > 0
    ) || [])[0];
    return allocationWithResults
      ? allocationWithResults
      : groupedAllocations[key][0];
  });
  return alls;
}

function getAuthorizationDetails(sample) {
  const approvedAllocations = _.flatten(
    sample?.orders?.map((order) => {
      return (
        order?.testAllocations?.filter(
          (allocation) =>
            (
              allocation?.statuses?.filter(
                (status) =>
                  status?.status == "APPROVED" || status?.category == "APPROVED"
              ) || []
            )?.length > 0
        ) || []
      );
    })
  );
  const allocationStatuses = _.uniqBy(
    _.flatten(
      approvedAllocations?.map((allocation) => {
        return allocation?.statuses?.map((status) => {
          return {
            ...status,
            allocation: allocation,
          };
        });
      })
    )?.map((status) => {
      return {
        ...status,
        ...status?.user,
        name: status?.user?.display?.split(" (")[0],
      };
    }),
    "name"
  );
  return allocationStatuses;
}

export function createSearchingText(sample) {
  return (
    sample?.label +
    "-" +
    sample?.patient?.givenName +
    sample?.patient?.middleName +
    sample?.patient?.familyName +
    sample?.patient?.identifiers[0]?.id +
    _.map(sample?.orders, (order) => {
      return order?.order?.concept?.display;
    }).join("-")
  );
}

function formatUserChangedStatus(statusDetails) {
  if (statusDetails)
    return {
      ...statusDetails,
      user: {
        display: statusDetails?.user?.name?.split(" (")[0],
        name: statusDetails?.user?.name?.split(" (")[0],
        uuid: statusDetails?.user?.uuid,
      },
    };
  return null;
}

function getOrdersWithResults(orders) {
  let newOrders: any[] = [];

  orders?.forEach((order) => {
    if (order?.testAllocations?.length > 0) {
      order?.testAllocations?.forEach((allocation) => {
        if (allocation?.results?.length > 0) {
          newOrders = [
            ...newOrders,
            {
              ...order,
              conceptUuid: allocation?.concept?.uuid,
            },
          ];
        }
      });
    }
  });

  return (
    newOrders?.map((order) => {
      return {
        ...order,
        testAllocations:
          order?.testAllocations?.filter(
            (allocation) => allocation?.results?.length > 0
          ) || [],
      };
    }) || []
  );
}

function keyLevelTwoConceptSetMembers(members) {
  let testToContainers = {};
  _.map(members, (member) => {
    _.map(member?.setMembers, (container) => {
      testToContainers[container?.uuid] = {
        ...member,
      };
    });
  });
  return testToContainers;
}

function formatResults(results) {
  // console.log(results);
  return _.orderBy(
    _.map(results, (result) => {
      return {
        value: result?.valueText
          ? result?.valueText
          : result.valueCoded
          ? result?.valueCoded?.uuid
          : result?.valueNumeric?.toString(),
        ...result,
        resultsFedBy: {
          name: result?.creator?.display
            ? result?.creator?.display.split("(")[0]
            : "",
          uuid: result?.creator?.uuid,
        },
      };
    }),
    ["dateCreated"],
    ["asc"]
  );
}

function getResultsCommentsStatuses(statuses) {
  return _.filter(statuses, (status) => {
    if (status?.status != "APPROVED" && status?.status != "REJECTED") {
      return status;
    }
  });
}
