import * as _ from "lodash";
import { VisitObject } from "../resources/visits/models/visit-object.model";

import {
  getVisitsByEncounterTypeWhereThereAreOrders,
  getPatientsByVisits,
  getEncountersForConsultation,
} from "./visits.helper";

export function formatPatientDetails(patient) {
  return {
    id: patient?.uuid,
    uuid: patient?.uuid,
    display: patient?.person?.display,
    gender: patient?.person?.gender,
    age: patient?.person?.age,
    birthdate: patient?.person?.birthdate,
    birthdateEstimated: patient?.person?.birthdateEstimated,
    dead: patient?.person?.dead,
    deathDate: patient?.person?.deathDate,
    causeOfDeath: patient?.person?.causeOfDeath,
    firstName: patient?.person?.preferredName?.givenName,
    middleName: patient?.person?.preferredName?.middleName,
    lastName: patient?.person?.preferredName?.familyName,
    voided: patient.person.preferredName.voided,
    mrNo: patient.person.display.split(" - ")[0],
    searchingText:
      patient.person?.preferredName?.givenName +
      "-" +
      patient?.person?.preferredName?.familyName +
      "-" +
      patient?.person?.preferredName?.middleName +
      "-" +
      patient?.person?.display +
      patient?.person?.age +
      patient?.person?.gender,
    visits: null,
  };
}

function getPatientVisits(id, visits) {
  return getVisitsByEncounterTypeWhereThereAreOrders(
    visits,
    "Consultation"
  ).filter((visit) => {
    if (visit?.patientUuid == id) {
      return visit;
    }
  });
}

function mergeEncountersOrdersByVisitsDetails(visits) {
  let formattedVisits = [];

  _.each(visits, (visit) => {
    formattedVisits = [
      ...formattedVisits,
      {
        orders: getOrdersSpecificToEncounterType(
          visit.encounters,
          "Consultation"
        ),
        obs: getObservations(visit.encounters),
        visitUuid: visit?.uuid,
        startDatetime: visit.startDatetime,
        patient: visit?.patient,
      },
    ];
  });
  return formattedVisits;
}

function getOrdersSpecificToEncounterType(encounters, encounterType) {
  let orders = [];
  let acceptRejectObsKeyValuePairs = {};

  _.each(encounters, (encounterForAcceptReject) => {
    if (
      encounterForAcceptReject.encounterType.display == "ACCEPT_REJECT_RESULTS"
    ) {
      _.map(encounterForAcceptReject.obs, (observation) => {
        acceptRejectObsKeyValuePairs[observation?.concept?.display] =
          acceptRejectObsKeyValuePairs[observation?.concept?.display]
            ? Number(
                acceptRejectObsKeyValuePairs[observation?.concept?.display]
              ) + Number(observation?.value)
            : Number(observation?.value);
      });
    }
  });

  _.each(encounters, (encounter) => {
    if (encounter.encounterType.display == encounterType) {
      _.each(encounter.orders, (order) => {
        let matched = [];
        orders = [
          ...orders,
          {
            encounterType: encounter.encounterType,
            orderEncounterUuid: encounter.uuid,
            ...order,
            sampleCollection: getSampleCollectionStatus(encounters, order),
            signOff: {
              status:
                acceptRejectObsKeyValuePairs[order?.display] &&
                acceptRejectObsKeyValuePairs[order?.display] == 1
                  ? "First Sign Off"
                  : acceptRejectObsKeyValuePairs[order?.display] &&
                    acceptRejectObsKeyValuePairs[order?.display] > 1
                  ? "Second Sign Off"
                  : null,
            },
            orderNumber: order?.orderNumber,
          },
        ];
      });
    }
  });
  return orders;
}

function getSampleCollectionStatus(encounters, order) {
  let sampleCollectionData = {};
  _.each(encounters, (encounter) => {
    // console.log('collection', encounter);
    if (encounter.encounterType.display == "LAB_SAMPLE") {
      _.each(
        _.orderBy(
          formatObs(encounter.obs),
          ["conceptName", "value"],
          ["asc", "desc"]
        ),
        (obs) => {
          if (obs.display.split(":")[0] == order.display) {
            sampleCollectionData["status"] =
              obs.value >= 1 ? "Collected" : "Rejected";
            sampleCollectionData["encounterUuid"] = encounter.uuid;
          }
        }
      );
    }
  });
  return sampleCollectionData;
}

function formatObs(obs) {
  return _.map(obs, (observation) => {
    return {
      uuid: observation.uuid,
      display: observation.display,
      value:
        observation.display.split("|").length > 1
          ? observation.display.split("|")[3]
          : parseInt(observation.display.split(": ")[1]),
      conceptName: observation.display.split(": ")[0],
    };
  });
}

function getObservations(encounters) {
  let obs = [];
  _.each(encounters, (encounter) => {
    _.each(encounter.obs, (observation) => {
      obs = [
        ...obs,
        { encounterType: encounter.encounterType, ...observation },
      ];
    });
  });
  return obs;
}

function setPriorityStatus(obs, visitUuid, sampleUuid) {
  let hiPriority = false;
  _.each(obs, (observation) => {
    if (
      observation.display.indexOf("Sample priority") > -1 &&
      observation.display.indexOf(visitUuid) > -1 &&
      observation.display.indexOf(sampleUuid) > -1
    ) {
      hiPriority =
        observation.display.split("|")[3] &&
        (observation.display.split("|")[3] == "Urgent" ||
          observation.display.split("|")[3] == "HIGH")
          ? true
          : false;
    }
  });
  return hiPriority;
}

function getSampleUniqueIdentifier(obs, visitUuid, sampleId) {
  let identifier = "";
  _.each(obs, (observation) => {
    if (
      observation?.display.indexOf("Sample identifier") > -1 &&
      observation?.display.indexOf(visitUuid) > -1 &&
      observation?.display.indexOf(sampleId) > -1
    ) {
      identifier =
        identifier == "" ? observation.display.split("|")[3] : identifier;
    }
  });
  // console.log('identifier', identifier);
  // console.log('sampleId', sampleId);
  return identifier;
}

export function groupAllActiveVisitsLabOrdersBySampleTypes(
  visits,
  sampleTypes,
  labOrdersBillingInfo
) {
  let filteredSamples = [];

  const patientUuids = _.map(visits, (visit) => {
    return visit?.patient?.uuid;
  });
  let patientVisitsDetails = [];
  _.map(patientUuids, (uuid) => {
    if (
      getPatientVisits(
        uuid,
        getVisitsByEncounterTypeWhereThereAreOrders(visits, "Consultation")
      )?.length > 0
    )
      patientVisitsDetails = [
        ...patientVisitsDetails,
        ...mergeEncountersOrdersByVisitsDetails(
          getPatientVisits(
            uuid,
            getVisitsByEncounterTypeWhereThereAreOrders(visits, "Consultation")
          )
        ),
      ];
  });
  const filteredVisits = _.filter(visits, (visit) => {
    const encounters = _.filter(visit?.encounters, (encounter) => {
      if (encounter.encounterType.display == "LAB_SAMPLE") {
        return visit;
      }
    });
    if (encounters && encounters.length > 0) {
      return visit;
    }
  });
  const sampledOrders = getSampledOrdersInformationByVisits(
    filteredVisits,
    "LAB_SAMPLE",
    sampleTypes
  );
  const labOrders = getLabOrdersInformationByVisits(
    filteredVisits,
    "Consultation",
    sampleTypes
  );

  const ordersWithIntermediateResults = getIntermediateResults(
    filteredVisits,
    "UN_APPROVED_LAB_RESULTS",
    sampleTypes
  );

  const ordersOnAcceptOrReject = getOrdersOnAcceptOrRejectCondition(
    filteredVisits,
    "ACCEPT_REJECT_RESULTS",
    sampleTypes
  );

  const formattedSampledOrders = _.groupBy(
    addLabOrdersEncounterUuidToSampledOrders(
      sampledOrders,
      labOrders,
      ordersWithIntermediateResults,
      ordersOnAcceptOrReject
    ),
    "visitUuid"
  );

  // console.log('formattedSampledOrders', formattedSampledOrders);
  // console.log('patientVisitsDetails', patientVisitsDetails);
  _.each(patientVisitsDetails, (visit) => {
    // console.log('visit to check', visit);
    // console.log(formattedSampledOrders[visit?.visitUuid]);
    if (
      formattedSampledOrders[visit?.visitUuid] &&
      formattedSampledOrders[visit?.visitUuid]?.length > 0
    ) {
      filteredSamples = [
        ...filteredSamples,
        ...groupLabOrdersBySampleType(
          visit,
          sampleTypes,
          labOrdersBillingInfo,
          visit?.patient?.uuid
        ),
      ];
    } else {
      // console.log('none');
    }
  });

  // console.log('filteredSamples', filteredSamples);
  // merge with orders statuses
  let formattedSamples = _.map(filteredSamples, (filteredSample) => {
    const mergedOrders = mergeOrdersDetails(
      filteredSample?.allOrders,
      formattedSampledOrders[filteredSample?.visitUuid],
      filteredSample
    );

    // console.log('mergedOrders...........', mergedOrders);

    const itemsWithResults = getItemsWithResults(mergedOrders);
    const itemsWithNoResults = getItemsWithNoResults(mergedOrders);
    // if (!filteredSample?.id)
    return {
      ...filteredSample,
      orders: _.filter(mergedOrders, { collected: true }),
      collected:
        (_.filter(mergedOrders, { collected: true }) || [])?.length > 0
          ? true
          : false,
      accepted:
        (_.filter(mergedOrders, { accepted: true }) || [])?.length ==
        mergedOrders?.length
          ? true
          : false,
      rejected:
        (_.filter(mergedOrders, { rejected: true }) || [])?.length > 0
          ? true
          : false,
      atLeastOneHasFirstSignOff:
        (_.filter(mergedOrders, { firstSignOff: true }) || [])?.length > 0
          ? true
          : false,
      atLeastOneHasSecondSignOff:
        (_.filter(mergedOrders, { secondSignOff: true }) || [])?.length > 0
          ? true
          : false,
      patient: mergedOrders?.length > 0 ? mergedOrders[0]?.patient : null,
      mrNo:
        mergedOrders?.length > 0
          ? mergedOrders[0]?.patient?.identifiers[0]?.display.split("= ")[1]
          : "",
      allHaveResults: areAllHaveResults(mergedOrders),
      fullCompleted:
        areAllHaveResults(mergedOrders) && areAllApproved(mergedOrders)
          ? true
          : false,
      patientNames:
        mergedOrders?.length > 0
          ? mergedOrders[0]?.patient?.display.split(" - ")[1]
          : "",
      searchingText:
        (mergedOrders?.length > 0
          ? mergedOrders[0]?.patient?.display.split(" - ")[1]
          : "") +
        (mergedOrders?.length > 0
          ? mergedOrders[0]?.patient?.identifiers[0]?.display.split("= ")[1]
          : "") +
        filteredSample?.sampleUniquIdentification +
        filteredSample?.sampleName,

      sampleCollectionEncounterUuid: (_.filter(mergedOrders, {
        collected: true,
      }) || [])[0]?.sampleCollectionEncounterUuid,
      sampleCollectionProviders: getSampleCollectionProviders(mergedOrders),
      orderProviders: getOrderProviders(mergedOrders),
      resultsProviders: getResultsProviders(mergedOrders),
      acceptRejectProviders: getAcceptanceRejectionProviders(mergedOrders),
      rejectionReason: getRejectionReason(
        visits,
        "LAB_SAMPLE",
        filteredSample.sampleUniquIdentification,
        filteredSample?.visitUuid
      ),
    };
  });
  return formattedSamples;
}

function getAcceptanceRejectionProviders(orders) {
  let providers = [];
  _.map(orders, (order) => {
    if (order?.acceptRejectProviders) {
      providers = [...providers, ...order?.acceptRejectProviders];
    }
  });
  return _.uniqBy(providers, "uuid");
}

function getResultsProviders(orders) {
  let providers = [];
  _.map(orders, (order) => {
    if (order?.resultsProviders) {
      providers = [...providers, ...order?.resultsProviders];
    }
  });
  return _.uniqBy(providers, "uuid");
}

function getOrderProviders(orders) {
  let providers = [];
  _.map(orders, (order) => {
    if (order?.orderProviders) {
      providers = [...providers, ...order?.orderProviders];
    }
  });
  return _.uniqBy(providers, "uuid");
}

function getSampleCollectionProviders(orders) {
  let providers = [];
  _.map(orders, (order) => {
    if (order?.sampleCollectionProviders) {
      providers = [...providers, ...order?.sampleCollectionProviders];
    }
  });
  return _.uniqBy(providers, "uuid");
}

function areAllHaveResults(items) {
  let count = 0;
  _.each(items, (item) => {
    if (item?.result) {
      count = count + 1;
    }
  });
  return items?.length == count ? true : false;
}

function areAllApproved(items) {
  let count = 0;
  _.each(items, (item) => {
    if (item?.secondSignOff) {
      count = count + 1;
    }
  });
  return items?.length == count ? true : false;
}

function mergeOrdersDetails(orders, ordersWithStatus, sample) {
  let formattedOrders = [];
  // console.log('ordersWithStatus', ordersWithStatus);
  // console.log('orders', orders);
  _.each(orders, (order) => {
    let intermediateEncounterUuid = null;
    // _.each(ordersWithStatus, (orderTofilter) => {
    //   if (orderTofilter?.result) {
    //     intermediateEncounterUuid = orderTofilter?.intermediateEncounterUuid;
    //   }
    // });
    _.each(ordersWithStatus, (orderWithStatus) => {
      if (order?.concept?.uuid == orderWithStatus?.concept?.uuid) {
        formattedOrders = [
          ...formattedOrders,
          {
            ...order,
            selectionOptions:
              order?.concept &&
              order?.concept.numeric &&
              order?.concept.lowNormal &&
              order?.concept.hiNormal
                ? generateSelectionOptions(
                    order?.concept.lowNormal,
                    order?.concept.hiNormal
                  )
                : [],
            shouldUseGeneratedNumericOptions: false,
            remarks: orderWithStatus?.remarks,
            obsUuid: orderWithStatus?.uuid,
            allValues: orderWithStatus?.allValues,
            sample: sample,
            collected: orderWithStatus?.collected,
            accepted: orderWithStatus?.accepted,
            rejected: orderWithStatus?.rejected,
            labOrderEncounterUuid: orderWithStatus?.labOrderEncounterUuid,
            intermediateEncounterUuid: intermediateEncounterUuid,
            firstSignOff: orderWithStatus?.firstSignOff,
            secondSignOff: orderWithStatus?.secondSignOff,
            result: orderWithStatus?.result,
            hiPriority: orderWithStatus?.hiPriority,
            patient: orderWithStatus?.patient,
            sampleType: orderWithStatus?.sampleType,
            sampleTypeName: orderWithStatus?.sampleTypeName,
            sampleUniquIdentification: sample?.id,
            visitUuid: sample?.visitUuid,
            sampleCollectionProviders:
              orderWithStatus?.sampleCollectionProviders,
            orderProviders: orderWithStatus?.orderProviders,
            resultsProviders: orderWithStatus?.resultsProviders,
            sampleCollectionEncounterUuid: orderWithStatus?.encounter?.uuid,
            acceptRejectProviders: orderWithStatus?.acceptRejectProviders,
            searchingText:
              order?.display +
              "-" +
              order?.orderNumber +
              "-" +
              orderWithStatus?.sampleTypeName,
            location: orderWithStatus?.location,
          },
        ];
      }
    });
  });
  return formattedOrders;
}

function setStatusOnOrders(
  visit,
  setMembers,
  labOrdersBillingInfo,
  sampleTypeName,
  sampleTypeId
) {
  // console.log('obs by visit', visit?.obs, sampleTypeId);
  // const id = getSampleUniqueIdentifier(visit.obs, visit.uuid, sampleTypeId);
  const matchedObs =
    _.filter(visit?.obs, (observation) => {
      if (
        observation?.concept?.display == "Sample identifier" &&
        observation?.value?.indexOf(sampleTypeId) > -1
      ) {
        return observation;
      }
    }) || [];
  // console.log('matchedObs', matchedObs);
  // console.log('sampleTypeId', sampleTypeId);
  const id = matchedObs?.length > 0 ? matchedObs[0].value.split("|")[3] : null;
  return _.filter(
    _.map(visit?.orders, (order) => {
      const matchedConcept = (_.filter(setMembers, {
        name: order.display,
      }) || [])[0];
      if (matchedConcept) {
        //   console.log('id', sampleTypeName, id, sampleTypeId);
        return {
          ...order,
          concept: matchedConcept,
          status:
            labOrdersBillingInfo &&
            labOrdersBillingInfo[visit?.uuid + "-" + matchedConcept?.uuid]
              ? "Paid"
              : "Not paid",
          searchingText:
            order?.display +
            "-" +
            order?.concept?.display +
            (visit?.patient && visit?.patient?.identifiers
              ? visit?.patient?.identifiers[0]?.display.split("= ")[1]
              : "") +
            order?.orderNumber,
          location: order?.location,
          sampleTypeName: sampleTypeName,
          sampleUniquIdentification: id,
        };
      }
    }),
    (order) => order
  );
}

function formatVisitDetails(visit) {
  // console.log('visitvisit', visit);
  const consultationEncounters = getEncountersForConsultation([visit]);
  const sampleCollectionAndAcceptanceEncounters = _.filter(
    visit?.encounters,
    (encounter) => {
      if (encounter.encounterType.display == "LAB_SAMPLE") {
        return visit;
      }
    }
  );

  let collectedItems = {};
  _.map(sampleCollectionAndAcceptanceEncounters, (encounter) => {
    _.map(encounter?.obs, (observation) => {
      collectedItems[visit?.uuid + "-" + observation?.concept?.display] =
        observation;
    });
  });

  let acceptedItems = {};

  _.map(sampleCollectionAndAcceptanceEncounters, (encounter) => {
    _.map(encounter?.obs, (observation) => {
      if (observation?.value == 2) {
        acceptedItems[visit?.uuid + "-" + observation?.concept?.display] =
          observation;
      }
    });
  });

  let rejectedItems = {};

  let obs = [];
  _.map(sampleCollectionAndAcceptanceEncounters, (encounter) => {
    _.map(encounter?.obs, (observation) => {
      obs = [...obs, observation];
      if (observation?.value == 0) {
        rejectedItems[visit?.uuid + "-" + observation?.concept?.display] =
          observation;
      }
    });
  });

  // console.log(
  //   'sampleCollectionAndAcceptanceEncounters',
  //   sampleCollectionAndAcceptanceEncounters
  // );

  // console.log('collectedItems', collectedItems);

  let orders = [];
  _.map(consultationEncounters, (encounter) => {
    _.map(encounter?.orders, (order) => {
      orders = [
        ...orders,
        {
          ...order,
          labOrderEncounterUuid: encounter?.uuid,
          location: encounter?.location,
          selectionOptions:
            order?.concept &&
            order?.concept.numeric &&
            order?.concept.lowNormal &&
            order?.concept.hiNormal
              ? generateSelectionOptions(
                  order?.concept.lowNormal,
                  order?.concept.hiNormal
                )
              : [],
          sampleCollection: {
            status: collectedItems[visit?.uuid + "-" + order?.display]
              ? "Collected"
              : null,
            obs: collectedItems[visit?.uuid + "-" + order?.display]
              ? collectedItems[visit?.uuid + "-" + order?.display]
              : null,
            sampleCollectionEncounterUuid: collectedItems[
              visit?.uuid + "-" + order?.display
            ]
              ? collectedItems[visit?.uuid + "-" + order?.display]?.encounter
                  ?.uuid
              : null,
            encounter: encounter,
          },
          collected: collectedItems[visit?.uuid + "-" + order?.display]
            ? true
            : false,
          accepted: acceptedItems[visit?.uuid + "-" + order?.display]
            ? true
            : false,
          acceptObsUuid: acceptedItems[visit?.uuid + "-" + order?.display]
            ? acceptedItems[visit?.uuid + "-" + order?.display]?.uuid
            : null,
          rejected: rejectedItems[visit?.uuid + "-" + order?.display]
            ? true
            : false,
          rejectObsUuid: rejectedItems[visit?.uuid + "-" + order?.display]
            ? rejectedItems[visit?.uuid + "-" + order?.display]?.uuid
            : null,
        },
      ];
      // console.log('orders', orders);
    });
  });

  return {
    visitUuid: visit?.uuid,
    orders: orders,
    obs: obs,
    ...visit,
  };
}

export function groupLabOrdersBySampleType(
  visitDetails,
  sampleTypes,
  labOrdersBillingInfo,
  patientUuid
) {
  // console.log('visitDetails', visitDetails);
  const visit = formatVisitDetails(visitDetails);

  const filteredSampleTypes = _.map(sampleTypes, (sampleType) => {
    const ordersWithStatus = setStatusOnOrders(
      visit,
      sampleType?.setMembers,
      labOrdersBillingInfo,
      sampleType?.name,
      sampleType?.uuid
    );

    // console.log('visit', visit?.obs);
    // console.log('sampleType', sampleType?.name);
    const id =
      ordersWithStatus?.length > 0
        ? (_.filter(ordersWithStatus, (order) => {
            if (order?.sampleCollection?.status == "Collected") {
              return order;
            }
          }) || [])[0]?.sampleUniquIdentification
        : null;
    // console.log(
    //   'checking ............',
    //   (_.filter(ordersWithStatus, (order) => {
    //     if (order?.sampleCollection?.status == 'Collected') {
    //       return order;
    //     }
    //   }) || [])[0]
    // );
    return {
      sampleId: sampleType.uuid,
      sampleName: sampleType?.display,
      name: sampleType.display,
      allOrders: _.filter(ordersWithStatus, (order) => {
        if (order?.sampleCollection?.status) {
          return order;
        }
      }),
      orders: _.filter(ordersWithStatus, { status: "Paid" }),
      items: _.filter(ordersWithStatus, { status: "Paid" }),
      atLeastOneOrderPaid:
        (_.filter(ordersWithStatus, { status: "Paid" }) || [])?.length > 0
          ? true
          : false,
      allOrdersPaid:
        (_.filter(ordersWithStatus, { status: "Paid" }) || [])?.length ==
        visit?.orders?.length
          ? true
          : false,
      atLeastOneOrderBilled: _.filter(ordersWithStatus, {
        status: "Paid",
        sampleTypeName: sampleType?.display,
      }),
      sampleUniquIdentification: id,
      id: id,
      countOfOrdersBilled: (
        _.filter(ordersWithStatus, {
          status: "Paid",
          sampleTypeName: sampleType?.display,
        }) || []
      )?.length,
      countOfOrdersPaid: (
        _.filter(ordersWithStatus, {
          status: "Paid",
          sampleTypeName: sampleType?.display,
        }) || []
      )?.length,
      collected:
        (
          _.filter(ordersWithStatus, {
            collected: true,
            sampleTypeName: sampleType?.display,
          }) || []
        )?.length > 0
          ? true
          : false,
      secondSignOff: false,
      firstSignOff: false,
      priorityHigh: setPriorityStatus(
        visit.obs,
        visit?.visitUuid,
        sampleType.uuid
      ),
      visitStartDatetime: visit.startDatetime,
      visitUuid: visit?.visitUuid,
      sampleCollectionEncounterUuid: (_.filter(ordersWithStatus, {
        collected: true,
        sampleTypeName: sampleType?.display,
      }) || [])[0]?.sampleCollection?.encounterUuid,
      patientUuid: patientUuid,
      patient: visit?.patient,
      mrNo:
        visit?.patient && visit?.patient?.identifiers
          ? visit?.patient?.identifiers[0]?.display.split("= ")[1]
          : "",
      searchingText:
        (visit?.patient && visit?.patient?.identifiers
          ? visit?.patient?.identifiers[0]?.display.split("= ")[1]
          : "") + sampleType?.display,
    };
    // console.log(groupedOrders);
    // return groupedOrders;
    // filteredSampleTypes = [...filteredSampleTypes, groupedOrders];
  });
  // console.log('filteredSampleTypes', filteredSampleTypes);
  if (labOrdersBillingInfo) {
    return _.orderBy(
      _.filter(filteredSampleTypes, (filteredSampleType) => {
        if (filteredSampleType.orders.length > 0) {
          return filteredSampleType;
        }
      }),
      ["name"],
      ["asc"]
    );
  } else {
    return _.orderBy(
      _.filter(
        _.map(filteredSampleTypes, (filteredSampleType) => {
          if (filteredSampleType.allOrders.length > 0) {
            return {
              ...filteredSampleType,
              orders: filteredSampleType?.allOrders,
            };
          }
        }),
        (sample) => sample
      ),
      ["name"],
      ["asc"]
    );
  }
}

export function formatSamplesToFeedResults(samples) {
  return _.map(samples, (sample) => {
    return {
      id: sample.sampleUniquIdentification,
      name: sample.sampleName + "-" + sample.sampleUniquIdentification,
      mrNo: sample.patient.display.split(" - ")[0],
      patientNames: sample.patient.display.split(" - ")[1],
      ...sample,
    };
  });
}

export function getSamplesToCollect(visits, sampleTypes) {
  let samplesToCollect = [];
  _.each(_.uniqBy(visits, "uuid"), (visit) => {
    _.each(sampleTypes, (sampleType) => {
      let groupedOrders = {
        visitUuid: visit.id,
        patient: visit.patient,
        sampleId: sampleType.uuid,
        sampleName: sampleType.display,
        name: sampleType.display,
        orders: [],
      };

      _.each(
        getOrdersFromEncounters(visit.encounters, "Consultation"),
        (order) => {
          const filteredConcept = _.filter(sampleType.setMembers, {
            name: order.display,
          });
          if (filteredConcept && filteredConcept.length > 0) {
            groupedOrders.orders = [
              ...groupedOrders.orders,
              { concept: filteredConcept[0].uuid, ...order },
            ];
          }
        }
      );
      samplesToCollect = [...samplesToCollect, groupedOrders];
    });
  });
  return _.orderBy(
    _.filter(samplesToCollect, (sampleToCollect) => {
      if (sampleToCollect.orders.length > 0) {
        return sampleToCollect;
      }
    }),
    ["name"],
    ["asc"]
  );
}

function getOrdersFromEncounters(encounters, encounterType) {
  let orders = [];
  _.map(
    _.filter(encounters, (encounter) => {
      if (encounter.encounterType.display == encounterType) {
        return encounter;
      }
    }),
    (filteredEncounter) => {
      if (filteredEncounter.orders && filteredEncounter.orders.length > 0) {
        orders = [...orders, ...filteredEncounter.orders];
      }
    }
  );
  return orders;
}

export function getPatientsCollectedSamples(
  visits,
  sampleTypes,
  labOrdersBillingInfo
) {
  // console.log('getPatientsCollectedSamples', visits);
  const sampledOrders = getSampledOrdersInformationByVisits(
    visits,
    "LAB_SAMPLE",
    sampleTypes
  );
  const labOrders = getLabOrdersInformationByVisits(
    visits,
    "Consultation",
    sampleTypes
  );
  // console.log("gotten lab orders :: ", labOrders);

  const ordersWithIntermediateResults = getIntermediateResults(
    visits,
    "UN_APPROVED_LAB_RESULTS",
    sampleTypes
  );

  const ordersOnAcceptOrReject = getOrdersOnAcceptOrRejectCondition(
    visits,
    "ACCEPT_REJECT_RESULTS",
    sampleTypes
  );

  // console.log('ordersWithIntermediateResults', ordersWithIntermediateResults);

  // console.log('sampledOrders', sampledOrders);

  // console.log('ordersWithIntermediateResults', ordersWithIntermediateResults);

  const formattedSampledOrders = _.groupBy(
    addLabOrdersEncounterUuidToSampledOrders(
      sampledOrders,
      labOrders,
      ordersWithIntermediateResults,
      ordersOnAcceptOrReject
    ),
    "visitUuid"
  );

  let samplesCollected = [];
  _.each(Object.keys(formattedSampledOrders), (key) => {
    /* console.log(addLabOrdersEncounterUuidToSampledOrders(
      sampledOrders,
      labOrders,
      ordersWithIntermediateResults,
      ordersOnAcceptOrReject
    ))*/
    const samples = _.groupBy(formattedSampledOrders[key], "sampleTypeName");
    // console.log("SAMPLES", samples)
    samplesCollected = [
      ...samplesCollected,
      ..._.map(Object.keys(samples), (sampleKey) => {
        const itemsWithResults = getItemsWithResults(samples[sampleKey]);
        const allItems = samples[sampleKey];

        //console.log("all items :: ",allItems)
        return {
          visitUuid: key,
          id: samples[sampleKey][0].sampleUniquIdentification,
          sampleName: sampleKey,
          name: sampleKey,
          searchingText:
            sampleKey +
            samples[sampleKey][0].sampleUniquIdentification +
            samples[sampleKey][0]?.patient?.display,
          identifier: samples[sampleKey][0].encounterUuid,
          sampleUniquIdentification:
            samples[sampleKey][0].sampleUniquIdentification,
          patient: samples[sampleKey][0].patient,
          patientNames: samples[sampleKey][0]?.patient?.display.split(" -")[1],
          mrNoForSorting: samples[sampleKey][0]?.patient?.display.split("-")[2],
          mrNo: samples[sampleKey][0].patient.display.split(" - ")[0],
          accepted: checkStatusOfOrders(samples[sampleKey], "accepted"),
          rejected: checkStatusOfOrders(samples[sampleKey], "rejected"),
          rejectionReason: getRejectionReason(
            visits,
            "LAB_SAMPLE",
            samples[sampleKey][0].sampleUniquIdentification,
            key
          ),
          collected: checkStatusOfOrders(samples[sampleKey], "collected"),
          acceptedName: checkStatusOfOrders(samples[sampleKey], "accepted")
            ? "accepted"
            : "",
          rejectedName: checkStatusOfOrders(samples[sampleKey], "rejected")
            ? "rejected"
            : "",
          collectedName: checkStatusOfOrders(samples[sampleKey], "collected")
            ? "collected"
            : "",
          allHaveResults:
            checkIfAllHaveResults(
              allItems,
              samples[sampleKey][0].sampleUniquIdentification
            ) == allItems?.length
              ? true
              : false,
          atLeastOneHasResult:
            itemsWithResults && itemsWithResults.length > 0 ? true : false,
          items: _.orderBy(allItems, ["display"], ["asc"]),
          hiPriority: getPriorityStatus(allItems),
          priority: getPriorityStatus(allItems) ? 1 : 0,
          priorityName: getPriorityStatus(allItems) ? "HIGH" : "None",
          firstSignOff:
            getItemsWithFirstSignOff(allItems) &&
            getItemsWithFirstSignOff(allItems).length == allItems.length
              ? true
              : false,
          secondSignOff:
            getItemsWithSecondSignOff(allItems) &&
            getItemsWithSecondSignOff(allItems).length == allItems.length
              ? true
              : false,
          atLeastOneRejectedResult:
            getItemsWithResultsRejected(allItems) &&
            getItemsWithResultsRejected(allItems).length > 0
              ? true
              : false,
          rejectedResults: getItemsWithResultsRejected(allItems),
        };
        // }
      }),
    ];
  });

  return _.orderBy(
    _.filter(samplesCollected, (sampleCollected) => {
      if (sampleCollected.sampleUniquIdentification != "") {
        return sampleCollected;
      }
    }),
    ["priority"],
    ["desc"]
  );
}

function checkIfAllHaveResults(items, sampleId) {
  let count = 0;
  _.each(items, (item) => {
    if (item?.result) {
      count = count + 1;
    }
  });
  return count;
}

function getRejectionReason(visits, encounterType, sampleID, visitUuid) {
  let reason = "";
  _.each(
    (_.filter(visits, { id: visitUuid }) || [])[0]?.encounters,
    (encounter) => {
      if (encounter?.encounterType?.name == encounterType) {
        _.each(encounter?.obs, (observation) => {
          if (
            observation.concept?.display == "Reason for rejecting sample" &&
            observation?.value.indexOf(sampleID) > -1
          ) {
            reason = observation?.value.split(" : ")[1];
          }
        });
      }
    }
  );
  //// console.log(reason, sampleID);
  return reason;
}

function getPriorityStatus(items) {
  if (
    _.filter(items, { hiPriority: true }) &&
    _.filter(items, { hiPriority: true }).length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

function getItemsWithFirstSignOff(items) {
  // console.log('items##############33', items);
  return _.filter(items, (item) => {
    if (item.firstSignOff) {
      return item;
    }
  });
}

function getItemsWithSecondSignOff(items) {
  return _.filter(items, (item) => {
    if (item.secondSignOff) {
      return item;
    }
  });
}

function getItemsWithResultsRejected(items) {
  return _.filter(items, (item) => {
    if (item.rejectedResults) {
      return item;
    }
  });
}

function getItemsWithNoResults(items) {
  // console.log(items);
  return _.filter(items, (item) => {
    if (item?.result == null) {
      return item;
    }
  });
}

function getItemsWithResults(items) {
  return _.filter(items, (item) => {
    if (item.result) {
      return item;
    }
  });
}

function checkStatusOfOrders(items, key) {
  if (
    key == "accepted" &&
    _.filter(items, { accepted: true }) &&
    _.filter(items, { accepted: true }).length > 0
  ) {
    return true;
  } else if (
    key == "rejected" &&
    _.filter(items, { rejected: true }) &&
    _.filter(items, { rejected: true }).length > 0
  ) {
    return true;
  } else if (
    key == "collected" &&
    _.filter(items, { collected: true }) &&
    _.filter(items, { collected: true }).length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

function addLabOrdersEncounterUuidToSampledOrders(
  sampledOrders,
  labOrders,
  ordersWithIntermediateResults,
  ordersOnAcceptOrReject
) {
  let formattedData = [];

  // console.log('lab orders', labOrders);
  // console.log('ordersWithIntermediateResults', ordersWithIntermediateResults);
  // console.log('ordersOnAcceptOrReject', ordersOnAcceptOrReject);

  _.map(Object.keys(labOrders), (key) => {
    if (key) {
      formattedData = [
        ...formattedData,
        {
          ...sampledOrders[key],
          result:
            ordersWithIntermediateResults[key] &&
            ordersWithIntermediateResults[key]["value"] &&
            ordersWithIntermediateResults[key]["value"] != ""
              ? ordersWithIntermediateResults[key]["value"]
              : null,
          remarks:
            ordersWithIntermediateResults[key] &&
            ordersWithIntermediateResults[key]["comment"] &&
            ordersWithIntermediateResults[key]["comment"] != ""
              ? ordersWithIntermediateResults[key]["comment"]
              : null,
          obsUuid:
            ordersWithIntermediateResults[key] &&
            ordersWithIntermediateResults[key]["uuid"] &&
            ordersWithIntermediateResults[key]["uuid"] != ""
              ? ordersWithIntermediateResults[key]["uuid"]
              : null,
          intermediateEncounterUuid:
            ordersWithIntermediateResults[key] &&
            ordersWithIntermediateResults[key]["encounterUuid"]
              ? ordersWithIntermediateResults[key]["encounterUuid"]
              : null,
          firstSignOff:
            ordersOnAcceptOrReject[key] &&
            ordersOnAcceptOrReject[key]["value"] &&
            parseInt(ordersOnAcceptOrReject[key]["value"]) >= 1
              ? true
              : false,
          secondSignOff:
            ordersOnAcceptOrReject[key] &&
            ordersOnAcceptOrReject[key]["value"] &&
            parseInt(ordersOnAcceptOrReject[key]["value"]) > 1
              ? true
              : false,
          rejectedResults:
            ordersOnAcceptOrReject[key] &&
            ordersOnAcceptOrReject[key]["value"] &&
            parseInt(ordersOnAcceptOrReject[key]["value"]) == 0
              ? true
              : false,
          labOrderEncounterUuid: labOrders[key]
            ? labOrders[key]["encounterUuid"]
            : null,
          allValues:
            ordersWithIntermediateResults[key] &&
            ordersWithIntermediateResults[key]["allValues"] &&
            ordersWithIntermediateResults[key]["allValues"] != ""
              ? ordersWithIntermediateResults[key]["allValues"]
              : null,
          location: labOrders[key]?.encounter?.location,
          sampleCollectionProviders:
            sampledOrders[key]?.sampleCollectionProviders,
          orderProviders: labOrders[key]?.orderProviders,
          resultsProviders:
            ordersWithIntermediateResults[key]?.resultsProviders,
          acceptRejectProviders:
            ordersOnAcceptOrReject[key]?.acceptRejectProviders,
        },
      ];
    }
  });
  return _.filter(formattedData, (data) => {
    if (data?.uuid) {
      return data;
    }
  });
}

function getLabOrdersInformationByVisits(visits, encounterType, sampleTypes) {
  let ordersByVisit = {};
  _.each(visits, (visit) => {
    // console.log("visits", visit)
    _.each(visit.encounters, (encounter) => {
      if (encounter.encounterType.display == encounterType) {
        //console.log(encounter.orders)
        _.each(encounter.orders, (order) => {
          const key =
            visit.id && order.display
              ? visit.id + "-" + order.display
              : visit?.uuid + "-" + order?.concept?.display;
          ordersByVisit[key] = {
            ...order,
            visitUuid: visit.id,
            encounterUuid: encounter.uuid,
            patient: visit.patient,
            encounter: encounter,
            orderProviders: formatEncounterProviders(
              encounter?.encounterProviders
            ),
          };
        });
      }
    });
  });
  return ordersByVisit;
}

function getOrdersOnAcceptOrRejectCondition(
  visits,
  encounterType,
  sampleTypes
) {
  let ordersByVisit = {};
  _.each(visits, (visit) => {
    let obsData = {};
    _.each(visit.encounters, (encounter) => {
      if (encounter.encounterType.display == encounterType) {
        _.each(encounter.obs, (obs) => {
          const conceptName = obs.display.split(":")[0];
          const value = parseInt(obs.display.split(": ")[1]);

          obsData[conceptName] = !obsData[conceptName]
            ? value
            : obsData[conceptName] && obsData[conceptName] < value
            ? value
            : obsData[conceptName];
          ordersByVisit[visit?.uuid + "-" + conceptName] = {
            ...obs,
            value: obsData[conceptName],
            visitUuid: visit.id ? visit?.id : visit?.uuid,
            encounterUuid: encounter.uuid,
            patient: visit.patient,
            acceptRejectProviders: formatEncounterProviders(
              encounter?.encounterProviders
            ),
          };
        });
      }
    });
  });

  return ordersByVisit;
}

function getIntermediateResults(visits, encounterType, sampleTypes) {
  let ordersByVisit = {};
  _.each(visits, (visit) => {
    _.each(visit.encounters, (encounter) => {
      if (encounter.encounterType.display == encounterType) {
        // const obsDetails = getStatusOfSample(encounter.obs);
        // console.log('obsDetails', obsDetails);

        _.each(encounter.obs, (obs) => {
          const key = visit.id
            ? visit.id + "-" + obs?.concept?.display
            : visit?.uuid + "-" + obs?.concept?.display;
          !ordersByVisit[key]
            ? (ordersByVisit[key] = {
                ...obs,
                value: obs.display.split(": ")[1],
                visitUuid: visit.id ? visit?.id : visit?.uuid,
                encounterUuid: encounter.uuid,
                patient: visit.patient,
                allValues: [obs],
                resultsProviders: formatEncounterProviders(
                  encounter?.encounterProviders
                ),
              })
            : (ordersByVisit[key] = {
                ...ordersByVisit[key],
                allValues:
                  key?.split(obs?.concept?.display)[1] == ""
                    ? _.orderBy(
                        ...ordersByVisit[key]["allValues"],
                        obs,
                        ["dateActivated", "obsDatetime"],
                        ["desc", "desc"]
                      )
                    : ordersByVisit[key]["allValues"],
              });
        });
      }
    });
  });
  return ordersByVisit;
}

function getSampledOrdersInformationByVisits(
  visits,
  encounterType,
  sampleTypes
) {
  let ordersByVisit = {};
  _.each(visits, (visit) => {
    _.each(visit.encounters, (encounter) => {
      if (encounter.encounterType.display == encounterType) {
        const obsDetails = getStatusOfSample(encounter.obs);
        _.map(encounter.orders, (order) => {
          // if (
          //   order.display.toLowerCase().indexOf('sample identifier') == -1 ||
          //   order.display.toLowerCase().indexOf('sample priority') == -1
          // ) {
          let concept = null;
          const name =
            sampleTypes.filter((sampleType) =>
              sampleType.setMembers.some((item) => {
                if (item.display == order.display) {
                  concept = item;
                }
                return item.display == order.display;
              })
            )[0] &&
            sampleTypes.filter((sampleType) =>
              sampleType.setMembers.some((item) => {
                if (item.display == order.display) {
                  concept = item;
                }
                return item.display == order.display;
              })
            )[0].name
              ? sampleTypes.filter((sampleType) =>
                  sampleType.setMembers.some((item) => {
                    if (item.display == order.display) {
                      concept = item;
                    }
                    return item.display == order.display;
                  })
                )[0].name
              : "";
          const sampleTypeUuid =
            sampleTypes.filter((sampleType) =>
              sampleType.setMembers.some((item) => {
                if (item.display == order.display) {
                  concept = item;
                }
                return item.display == order.display;
              })
            )[0] &&
            sampleTypes.filter((sampleType) =>
              sampleType.setMembers.some((item) => {
                if (item.display == order.display) {
                  concept = item;
                }
                return item.display == order.display;
              })
            )[0].uuid
              ? sampleTypes.filter((sampleType) =>
                  sampleType.setMembers.some((item) => {
                    if (item.display == order.display) {
                      concept = item;
                    }
                    return item.display == order.display;
                  })
                )[0].uuid
              : "";
          if (concept) {
            const key =
              visit.id && order.display
                ? visit.id + "-" + order.display
                : visit?.uuid + "-" + concept?.display;

            ordersByVisit[key] =
              ordersByVisit[key] && ordersByVisit[key]["visitUuid"]
                ? ordersByVisit[key]
                : {
                    ...order,
                    visitUuid: visit?.uuid,
                    sampleUniquIdentification: getSampleUniqueIdentifier(
                      encounter.obs,
                      visit.id,
                      sampleTypeUuid
                    ),
                    encounterUuid: encounter.uuid,
                    patient: visit.patient,
                    location: encounter?.location,
                    hiPriority: setPriorityStatus(
                      encounter?.obs,
                      visit?.id,
                      sampleTypeUuid
                    ),
                    rejected:
                      _.filter(obsDetails, {
                        value: 0,
                        conceptName: concept?.display,
                      }) && _.filter(obsDetails, { value: 0 }).length > 0
                        ? true
                        : false,
                    accepted:
                      (
                        _.filter(obsDetails, {
                          value: 2,
                          conceptName: concept?.display,
                        }) || []
                      ).length > 0
                        ? true
                        : false,
                    collected:
                      (_.filter(obsDetails, {
                        value: 1,
                        conceptName: concept?.display,
                      }) &&
                        _.filter(obsDetails, {
                          value: 1,
                          conceptName: concept.display,
                        }).length > 0) ||
                      (_.filter(obsDetails, {
                        value: 2,
                        conceptName: concept.display,
                      }) &&
                        _.filter(obsDetails, {
                          value: 2,
                          conceptName: concept.display,
                        }).length > 0)
                        ? true
                        : false,
                    encounter: encounter,
                    sampleCollectionProviders: formatEncounterProviders(
                      encounter?.encounterProviders
                    ),
                    concept: concept,
                    searchingText:
                      concept?.display +
                      "-" +
                      getSampleUniqueIdentifier(
                        encounter.obs,
                        visit.id,
                        sampleTypeUuid
                      ) +
                      name +
                      order?.orderNumber,
                    selectionOptions:
                      concept &&
                      concept.numeric &&
                      concept.lowNormal &&
                      concept.hiNormal
                        ? generateSelectionOptions(
                            concept.lowNormal,
                            concept.hiNormal
                          )
                        : [],
                    sampleTypeName: name,
                    sampleType: sampleTypes.filter((sampleType) =>
                      sampleType.setMembers.some(
                        (item) => item.display == order.display
                      )
                    ),
                  };
          }
        });
      }
    });
  });
  return ordersByVisit;
}

export function formatEncounterProviders(providers) {
  return _.map(providers, (providerDetails) => {
    return {
      uuid: providerDetails?.uuid,
      provider: {
        uuid: providerDetails?.provider?.uuid,
        display: providerDetails?.provider?.display,
        name: providerDetails?.provider?.display,
      },
    };
  });
}

export function generateSelectionOptions(min, max) {
  let items = [];

  let diff = Number((max - min) / ((max - min) * 10));
  let startValue = Number(min);

  items = [...items, Number(min.toFixed(2))];
  for (var i = 0; i < (max - min) * 10; i++) {
    items = [...items, Number((startValue + Number(diff)).toFixed(2))];
    startValue += Number(diff.toFixed(2));
  }
  items = [...items, Number(max.toFixed(2))];
  return _.map(_.uniq(items).sort(), (option) => {
    return option.toString();
  });
}

function getStatusOfSample(obs) {
  return formatObs(obs);
}

export function formatPatientNotes(notes, patientUuid, conceptUuid) {
  const formattedNotes = _.map(notes.results, (result) => {
    return {
      id: patientUuid,
      conceptUuid: conceptUuid,
      visitUuid: result.encounter.visit.uuid,
      data: _.map(result.encounter.obs, (observation) => {
        return {
          title: observation?.concept?.display,
          uuid: observation?.uuid,
          observationMembers: _.map(
            observation?.groupMembers,
            (observationMember) => {
              return {
                display: observationMember?.concept?.display,
                value: observationMember?.value
                  ? observationMember?.value
                  : null,
                members: observationMember?.value
                  ? null
                  : _.map(observationMember?.groupMembers, (valueMember) => {
                      return {
                        display: valueMember?.concept?.display,
                        value:
                          typeof valueMember.value == "string" ||
                          typeof valueMember.value == "number"
                            ? valueMember.value
                            : valueMember.value?.display,
                      };
                    }),
              };
            }
          ),
        };
      }),
    };
  });

  if (formattedNotes?.length > 1) {
    let mergedNotes = {
      id: formattedNotes[0]?.id,
      conceptUuid: formattedNotes[0]?.conceptUuid,
      visitUuid: formattedNotes[0]?.visitUuid,
      data: [],
    };
    _.each(formattedNotes, (notes) => {
      mergedNotes.data = [...mergedNotes.data, ...notes?.data];
    });

    return [mergedNotes];
  } else return formattedNotes;
}

export function getAllDiagnosesFromVisitDetails(visit: VisitObject) {
  return visit.diagnoses;
}
