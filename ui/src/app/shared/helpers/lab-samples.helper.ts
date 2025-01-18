import * as _ from "lodash";
import {
  formatSampleTypes,
  keyDepartmentsByTestOrder,
  keySampleTypesByTestOrder,
} from "../helpers/sample-types.helper";
import { generateSelectionOptions } from "../helpers/patient.helper";

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

export function formatUserChangedStatus(statusDetails) {
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

export function formatResults(results) {
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

export function getResultsCommentsStatuses(statuses) {
  return _.filter(statuses, (status) => {
    if (status?.status != "APPROVED" && status?.status != "REJECTED") {
      return status;
    }
  });
}

export function formatSample(sample, formattingInfo) {
  const keyedDepartments = keyDepartmentsByTestOrder(
    formattingInfo?.departments
  );
  const keyedSpecimenSources = keySampleTypesByTestOrder(
    formattingInfo?.sampleTypes
  );
  const externalUseStatuses = sample?.statuses?.filter(
    (status) => status.status === "RELEASED" || status.status === "RESTRICTED"
  );
  return {
    ...sample,
    externalUseStatus: _.orderBy(externalUseStatuses, ["timestamp"], ["desc"]),
    id: sample?.label,
    specimen: keyedSpecimenSources[sample?.orders[0]?.order?.concept?.uuid],
    mrn: sample?.patient?.identifiers[0]?.id,
    department: keyedDepartments[sample?.orders[0]?.order?.concept?.uuid],
    collected: true,
    reasonForRejection:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "REJECTED"
        ? (formattingInfo?.codedSampleRejectionReasons.filter(
            (reason) =>
              reason.uuid ===
              _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.remarks
          ) || [])[0]
        : sample?.statuses?.length > 0 &&
          _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
            "RECOLLECT"
        ? (formattingInfo?.codedSampleRejectionReasons.filter(
            (reason) =>
              reason.uuid ===
              _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[1]?.remarks
          ) || [])[0]
        : null,
    markedForRecollection:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "RECOLLECT"
        ? true
        : false,
    disposed:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "DISPOSED"
        ? true
        : false,
    disposedAt: (_.filter(sample?.statuses, {
      status: "DISPOSED",
    }) || [])[0]?.timestamp,
    disposedBy:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "DISPOSED"
        ? _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.user
        : null,
    rejected:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "REJECTED"
        ? true
        : false,
    rejectedBy:
      sample?.statuses?.length > 0 &&
      _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
        "REJECTED"
        ? _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.user
        : null,
    departmentName:
      keyedDepartments[sample?.orders[0]?.order?.concept?.uuid]?.departmentName,
    collectedBy: {
      display: sample?.creator?.display?.split(" (")[0],
      name: sample?.creator?.display?.split(" (")[0],
      uid: sample?.creator?.uuid,
    },
    registeredBy: {
      display: sample?.creator?.display?.split(" (")[0],
      name: sample?.creator?.display?.split(" (")[0],
      uid: sample?.creator?.uuid,
    },
    accepted:
      (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])?.length > 0
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
      const allocationStatuses = _.flatten(
        order?.testAllocations?.map((allocation) => {
          return allocation?.statuses;
        })
      );

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
              keyedSpecimenSources[order?.order?.concept?.uuid]?.hiNormal &&
              keyedSpecimenSources[order?.order?.concept?.uuid]?.lowNormal
                ? generateSelectionOptions(
                    keyedSpecimenSources[order?.order?.concept?.uuid]
                      ?.lowNormal,
                    keyedSpecimenSources[order?.order?.concept?.uuid]?.hiNormal
                  )
                : [],
            setMembers:
              keyedDepartments[order?.order?.concept?.uuid]?.keyedConcept
                ?.setMembers?.length == 0
                ? []
                : _.map(
                    keyedDepartments[order?.order?.concept?.uuid]?.keyedConcept
                      ?.setMembers,
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
              keyedSpecimenSources[order?.order?.concept?.uuid]?.answers,
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
          (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])?.length > 0
            ? true
            : false,
        acceptedBy: formatUserChangedStatus(
          (_.filter(sample?.statuses, {
            status: "ACCEPTED",
          }) || [])[0]
        ),
        containerDetails: formattingInfo?.containers[
          order?.order?.concept?.uuid
        ]
          ? formattingInfo?.containers[order?.order?.concept?.uuid]
          : null,
        allocationStatuses: allocationStatuses,
        testAllocations: _.map(order?.testAllocations, (allocation) => {
          const authorizationStatus = _.orderBy(
            allocation?.statuses,
            ["timestamp"],
            ["desc"]
          )[0];
          return {
            ...allocation,
            authorizationInfo:
              authorizationStatus?.status === "APPROVED"
                ? authorizationStatus
                : null,
            firstSignOff:
              allocation?.statuses?.length > 0 &&
              _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                ?.status == "APPROVED"
                ? true
                : false,
            secondSignOff:
              allocation?.statuses?.length > 0 &&
              _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                ?.status == "APPROVED" &&
              _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[1]
                ?.status == "APPROVED"
                ? true
                : false,
            rejected:
              allocation?.statuses?.length > 0 &&
              _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                ?.status == "REJECTED"
                ? true
                : false,
            rejectionStatus:
              allocation?.statuses?.length > 0 &&
              _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                ?.status == "REJECTED"
                ? _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                : null,
            results: formatResults(allocation?.results),
            statuses: allocation?.statuses,
            resultsCommentsStatuses: getResultsCommentsStatuses(
              allocation?.statuses
            ),
            allocationUuid: allocation?.uuid,
          };
        }),
      };
    }),
    searchingText: createSearchingText(sample),
    priorityStatus: (sample?.statuses?.filter(
      (status) => status?.remarks === "PRIORITY"
    ) || [])[0],
    receivedOnStatus: (sample?.statuses?.filter(
      (status) => status?.remarks === "RECEIVED_ON"
    ) || [])[0],
    receivedByStatus: (sample?.statuses?.filter(
      (status) => status?.remarks === "RECEIVED_BY"
    ) || [])[0],
    priorityHigh:
      (
        sample?.statuses?.filter(
          (status) => status?.status === "HIGH" || status?.status === "Urgent"
        ) || []
      )?.length > 0
        ? true
        : false,
    priorityOrderNumber:
      (
        sample?.statuses?.filter(
          (status) => status?.status === "HIGH" || status?.status === "Urgent"
        ) || []
      )?.length > 0
        ? 0
        : 1,
    configs: formattingInfo?.configs,
  };
}
