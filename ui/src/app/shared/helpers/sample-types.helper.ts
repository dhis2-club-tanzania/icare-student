import * as _ from "lodash";
import { generateSelectionOptions } from "./patient.helper";

export function formatSampleTypes(samples) {
  const formattedSampleType = _.map(samples, (sample) => {
    return {
      id: sample.uuid,
      uuid: sample.uuid,
      name:
        sample?.display?.indexOf(":") > -1
          ? sample?.display?.split(":")[1]
          : sample?.display,
      display:
        sample?.display?.indexOf(":") > -1
          ? sample?.display?.split(":")[1]
          : sample?.display,
      links: sample.links,
      ...sample,
      setMembers: sample.setMembers ? formatSampleTypes(sample.setMembers) : [],
    };
  });
  //   console.log('formattedSampleType', formattedSampleType);
  return formattedSampleType;
}

export function formatSetMembers(SetMembers, SampleType, configs) {
  const formatedSetMembers = _.map(SetMembers, (test) => {
    return {
      id: test.uuid,
      uuid: test.uuid,
      name:
        test?.display?.indexOf(":") > -1
          ? test?.display?.split(":")[1]
          : test?.display,
      state: getSetMemberState(test, configs),
      sampletype: SampleType,
      mappings: test.mappings,
    };
  });
  return formatedSetMembers;
}

function getSetMemberState(test, configs) {
  // console.log('configs: ndani', configs);
  if (test && test["mappings"]) {
    let testAvailability = _.filter(test["mappings"], (mapping) => {
      return mapping["display"].includes("Lab Test Availability:");
    });

    if (testAvailability.length > 0) {
      if (testAvailability[0].conceptReferenceTerm.code == "yes") {
        return "active";
      } else if (testAvailability[0].conceptReferenceTerm.code == "no") {
        return "stalled";
      }
    } else {
      return "nostate";
    }
  }
}

export function getAllSampleTypesWithTheOrdersAsMember(sampleTypes, orders) {
  let allSampleTypesMatched = [];
  let patient = null;
  let visitUuid = null;
  // console.log('orders...........', orders);
  _.each(sampleTypes, (sampleType) => {
    let sampleTypeMatched = {
      id: sampleType.id,
      name: sampleType.name,
      orders: [],
      payed: 0,
      sampleEncounterUuid: null,
      patient: null,
      visitUuid: null,
    };
    let matchedOrders = [];
    let payed = 0;
    _.each(orders, (order) => {
      const filteredOrder = _.filter(sampleType.setMembers, {
        name: order.orderName,
      });
      if (filteredOrder && filteredOrder.length > 0) {
        matchedOrders = [...matchedOrders, order];
        patient = order.patient;
        visitUuid = order.visitUuid;
        // console.log('visit uuid', visitUuid);
        if (order.confirmed) {
          payed++;
        }
      }
    });
    sampleTypeMatched.orders = matchedOrders;
    sampleTypeMatched.payed = payed;
    sampleTypeMatched.patient = patient;
    sampleTypeMatched.visitUuid = visitUuid;
    // console.log(sampleTypeMatched);
    allSampleTypesMatched = [...allSampleTypesMatched, sampleTypeMatched];
  });
  return _.orderBy(
    _.filter(allSampleTypesMatched, (sampleTypesMatched) => {
      if (sampleTypesMatched.orders.length > 0) {
        return sampleTypesMatched;
      }
    }),
    ["name"],
    ["asc"]
  );
}

export function groupOrdersBySampleTypes(sampleTypes, orders) {
  const allSamplesWithOrders = getAllSampleTypesWithTheOrdersAsMember(
    sampleTypes,
    orders
  );

  return [];
}

export function flagOrdersIfReadyPutIntoSampleTypes(
  samplesDetails,
  ordersInformation
) {
  const ordersInSamples = createOrdersObject(samplesDetails);
  // console.log('ordersInSamples', ordersInSamples);
  const orders = createOrdersObject(ordersInformation);
  return _.map(Object.keys(orders), (key) => {
    if (ordersInSamples[key]) {
      return {
        addedToSample: true,
        ...orders[key],
        sampleEncounterUuid: ordersInSamples[key]["encounterUuid"],
      };
    } else {
      return {
        addedToSample: false,
        ...orders[key],
        sampleEncounterUuid: null,
      };
    }
  });
}

export function createOrdersObject(encounters) {
  let orders = {};
  _.each(encounters, (encounter) => {
    _.each(encounter.orders, (order) => {
      orders[
        order.display +
          "-" +
          encounter.patient.uuid +
          "-" +
          encounter.visit.uuid
      ] = {
        id:
          order.display +
          "-" +
          encounter.patient.uuid +
          "-" +
          encounter.visit.uuid,
        encounterUuid: encounter.uuid,
        ...order,
        patientUuid: encounter.patient.uuid,
        patientDisplay: encounter.patient.display,
      };
    });
  });
  return orders;
}

export function createSampleTypesWithOrdersInCreatedSamples(
  filteredSampleTypes
) {
  let samples = {};
  _.each(filteredSampleTypes, (sample) => {
    let orders = [];
    _.each(sample.orders, (order) => {
      if (order.orderSampled) {
        orders = [...orders, order];
      }
    });
    if (orders.length > 0) {
      samples[sample.id] = orders;
    }
  });
  // console.log('samples:::::::::::', samples);
  return samples;
}

export function keyDepartmentsByTestOrder(items) {
  let keyedTests = {};
  _.map(items, (item) => {
    _.map(item?.setMembers, (test) => {
      keyedTests[test?.uuid] = {
        departmentName:
          item?.display?.indexOf(":") > -1
            ? item?.display?.split(":")[1]
            : item?.display,
        departmentUuid: item?.uuid,
        ...item,
        display:
          item?.display?.indexOf(":") > -1
            ? item?.display?.split(":")[1]
            : item?.display,
        name:
          item?.display?.indexOf(":") > -1
            ? item?.display?.split(":")[1]
            : item?.display,
        keyedConcept: (item?.setMembers
          ?.map((member) => {
            return {
              ...member,
              display:
                member?.display?.indexOf(":") > -1
                  ? member?.display?.split(":")[1]
                  : member?.display,
              name:
                member?.display?.indexOf(":") > -1
                  ? member?.display?.split(":")[1]
                  : member?.display,
            };
          })
          ?.filter((member) => member?.uuid === test?.uuid) || [])[0],
      };
    });
  });
  return keyedTests;
}

export function keySampleTypesByTestOrder(items) {
  let keyedTests = {};
  _.map(items, (item) => {
    _.map(item?.setMembers, (test) => {
      keyedTests[test?.uuid] = {
        ...test,
        display:
          test?.display?.indexOf(":") > -1
            ? test?.display?.split(":")[1]
            : test?.display,
        name:
          test?.display?.indexOf(":") > -1
            ? test?.display?.split(":")[1]
            : test?.display,
        specimenName:
          item?.display?.indexOf(":") > -1
            ? item?.display?.split(":")[1]
            : item?.display,
        specimenUuid: item?.id,
      };
    });
  });
  return keyedTests;
}

function keyVisitsBymRN(visitsReferences) {
  let keyedVisits = {};
  _.map(visitsReferences, (visit) => {
    keyedVisits[visit?.identifier] = visit;
  });
  return keyedVisits;
}

function formulateConcept(concept) {
  return {
    ...concept,
    display:
      concept?.display?.indexOf(":") > -1
        ? concept?.display?.split(":")[1]
        : concept?.display,
    name:
      concept?.display?.indexOf(":") > -1
        ? concept?.display?.split(":")[1]
        : concept?.display,
    setMembers: _.map(concept?.setMembers, (setMember) => {
      return {
        ...setMember,
        display:
          setMember?.display?.indexOf(":") > -1
            ? setMember?.display?.split(":")[1]
            : setMember?.display,
        selectionOptions:
          setMember?.hiNormal && setMember?.lowNormal
            ? generateSelectionOptions(
                setMember?.lowNormal,
                setMember?.hiNormal
              )
            : [],
      };
    }),
    answers: _.map(concept?.answers, (answer) => {
      return {
        ...answer,
        display:
          answer?.display?.indexOf(":") > -1
            ? answer?.display?.split(":")[1]
            : answer?.display,
      };
    }),
  };
}

export function groupLabOrdersBySpecimenSources(
  labOrders,
  sampleTypes,
  collectedLabOrders,
  testsContainers,
  sampleContainers,
  visitReferences?,
  codedSampleRejectionReasons?,
  labConfigs?,
  labDepartments?
) {
  const keyedTests = keySampleTypesByTestOrder(sampleTypes);
  const visitsKeyedByMRN = keyVisitsBymRN(visitReferences);

  const departmentsKeyedByTestOrder = keyDepartmentsByTestOrder(labDepartments);

  // console.log('labOrders', labOrders)
  // _.map(labOrders,order => {
  //   if (order?.id == '107517-5-273/2021') {
  //     console.log(order)
  //   }
  // })
  let allSamples = [];
  let mySamples = [];
  _.map(labOrders, (labOrder) => {
    // if (labOrder?.id == '107806-2-3263249689/2020') {
    //   console.log(labOrder);
    // }
    const formattedOrders = _.uniqBy(
      _.map(labOrder?.groupedOrders, (order) => {
        const departmentAndSpecimenSource =
          departmentsKeyedByTestOrder[order?.concept_uuid]?.departmentName +
          "-" +
          keyedTests[order?.concept_uuid]?.specimenName;
        return {
          ...order,
          visit_concept_order:
            order?.visit_uuid +
            "-" +
            order?.concept_uuid +
            "-" +
            order?.order_uuid,
          containerDetails: testsContainers[order?.concept_uuid]
            ? testsContainers[order?.concept_uuid]
            : labConfigs["otherContainer"],
          allocations: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.allocations
            : [],
          orderer: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.orderer
            : { name: order?.orderer_names },
          collected: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? true
            : false,
          accepted:
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ] &&
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ]?.sampleAccepted
              ? true
              : false,
          acceptedBy: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.acceptedBy
            : null,
          results: [],
          reCollect:
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ] &&
            collectedLabOrders[order?.visit_uuid + "-" + order?.concept_uuid] +
              "-" +
              order?.order_uuid?.reCollect
              ? true
              : false,
          rejected:
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ] &&
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ]?.sampleRejected
              ? true
              : false,
          rejectionReason:
            collectedLabOrders[
              order?.visit_uuid +
                "-" +
                order?.concept_uuid +
                "-" +
                order?.order_uuid
            ] &&
            collectedLabOrders[order?.visit_uuid + "-" + order?.concept_uuid] +
              "-" +
              order?.order_uuid?.sampleRejected
              ? collectedLabOrders[
                  order?.visit_uuid +
                    "-" +
                    order?.concept_uuid +
                    "-" +
                    order?.order_uuid
                ]?.rejectionReason
              : "false",
          rejectedBy: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.rejectedBy
            : null,
          concept:
            keyedTests[order?.concept_uuid] &&
            keyedTests[order?.concept_uuid]?.setMembers?.length == 0
              ? keyedTests[order?.concept_uuid]
              : formulateConcept(keyedTests[order?.concept_uuid]),
          selectionOptions:
            keyedTests[order?.concept_uuid] &&
            keyedTests[order?.concept_uuid]?.numeric &&
            keyedTests[order?.concept_uuid]?.lowNormal &&
            keyedTests[order?.concept_uuid]?.hiNormal
              ? generateSelectionOptions(
                  keyedTests[order?.concept_uuid]?.lowNormal,
                  keyedTests[order?.concept_uuid]?.hiNormal
                )
              : [],
          specimenName: keyedTests[order?.concept_uuid]?.specimenName,
          specimenUuid: keyedTests[order?.concept_uuid]?.specimenUuid,
          patient: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.patient
            : null,
          collectedBy: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.collectedBy
            : null,
          rejectedAt: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.rejectedAt
            : null,
          acceptedAt: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.acceptedAt
            : null,
          sampleUuid: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.sampleUuid
            : null,
          sampleIdentifier: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.sampleIdentifier
            : null,
          priorityHigh: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.priorityHigh
            : null,
          sampleCollectionDate: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.sampleCollectionDate
            : null,
          unFormattedSampleCollectionDate: collectedLabOrders[
            order?.visit_uuid +
              "-" +
              order?.concept_uuid +
              "-" +
              order?.order_uuid
          ]
            ? collectedLabOrders[
                order?.visit_uuid +
                  "-" +
                  order?.concept_uuid +
                  "-" +
                  order?.order_uuid
              ]?.unFormattedSampleCollectionDate
            : null,
          ...departmentsKeyedByTestOrder[order?.concept_uuid],
          departmentAndSpecimenSource: departmentAndSpecimenSource,
          orderUuid: order?.order_uuid,
        };
      }),
      "visit_concept_order"
    );
    const groupedBySpecimen = _.groupBy(
      formattedOrders,
      "departmentAndSpecimenSource"
    );

    let recreatedSamples = [];
    const formulatedFromGroup = {
      mrNo: labOrder?.id,
      groupedOrders: _.filter(
        _.map(Object.keys(groupedBySpecimen), (key) => {
          if (key && key != "undefined") {
            const collectedSamples =
              _.filter(groupedBySpecimen[key], {
                collected: true,
              }) || [];

            // console.log("groupedBySpecimen[key]", groupedBySpecimen[key])
            const expectedSample = {
              id:
                groupedBySpecimen[key][0]?.departmentName +
                "-" +
                key +
                "-" +
                groupedBySpecimen[key][0]?.visit_uuid +
                "-",
              name: key,
              departmentName: groupedBySpecimen[key][0]?.departmentName,
              mrNo: labOrder?.id,
              patient_uuid:
                groupedBySpecimen[key]?.length > 0
                  ? groupedBySpecimen[key][0]?.patient_uuid
                  : null,
              patientNames: groupedBySpecimen[key][0]?.patient_names,
              collected: collectedSamples?.length > 0 ? true : false,
              accepted:
                (
                  _.filter(groupedBySpecimen[key], { sampleAccepted: true }) ||
                  []
                )?.length > 0
                  ? true
                  : false,
              rejected:
                (
                  _.filter(groupedBySpecimen[key], {
                    sampleRejected: true,
                    sampleAccepted: false,
                  }) || []
                )?.length > 0
                  ? true
                  : false,
              reCollect:
                (
                  _.filter(groupedBySpecimen[key], {
                    reCollect: true,
                    rejected: true,
                  }) || []
                )?.length > 0
                  ? true
                  : false,
              rejectedBy: groupedBySpecimen[key][0]?.rejectedBy,
              collectedBy: groupedBySpecimen[key][0]?.collectedBy,
              sampleCollectionDate:
                groupedBySpecimen[key][0]?.sampleCollectionDate,
              unFormattedSampleCollectionDate:
                groupedBySpecimen[key][0]?.unFormattedSampleCollectionDate,
              acceptedBy: groupedBySpecimen[key][0]?.acceptedBy,
              sampleUuid: groupedBySpecimen[key][0]?.sampleUuid,
              sampleIdentifier: groupedBySpecimen[key][0]?.sampleIdentifier,
              orders: groupedBySpecimen[key],
              rejectionReason:
                codedSampleRejectionReasons &&
                _.groupBy(codedSampleRejectionReasons, "uuid")[
                  groupedBySpecimen[key][0]?.rejectionReason
                ]
                  ? (_.groupBy(codedSampleRejectionReasons, "uuid")[
                      groupedBySpecimen[key][0]?.rejectionReason
                    ] || [])[0]?.display
                  : groupedBySpecimen[key][0]?.rejectionReason,
              containerDetails:
                testsContainers[groupedBySpecimen[key][0]?.specimenUuid],
              fullCompleted:
                (_.filter(groupedBySpecimen[key], { collected: true }) || [])
                  ?.length ===
                  (
                    _.filter(groupedBySpecimen[key], {
                      secondSignOff: true,
                    }) || []
                  )?.length &&
                (
                  _.filter(groupedBySpecimen[key], { secondSignOff: true }) ||
                  []
                )?.length !== 0
                  ? true
                  : false,
            };

            const groupedOrdersByCollection = _.groupBy(
              expectedSample?.orders,
              "sampleIdentifier"
            );

            const orderGroupedKeys = Object.keys(groupedOrdersByCollection);
            _.map(orderGroupedKeys, (key) => {
              if (key && key != "null") {
                recreatedSamples = [
                  ...recreatedSamples,
                  {
                    id: key,
                    searchingText:
                      key +
                      groupedOrdersByCollection[key][0]?.specimenName +
                      expectedSample?.mrNo +
                      groupedOrdersByCollection[key][0]?.patient_names +
                      groupedOrdersByCollection[key][0]?.sampleCollectionDate +
                      groupedOrdersByCollection[key][0]?.departmentName,
                    orders: groupedOrdersByCollection[key],
                    sampleIdentifier: key,
                    name: groupedOrdersByCollection[key][0]?.specimenName,
                    departmentName:
                      groupedOrdersByCollection[key][0]?.departmentName,
                    patient_uuid:
                      groupedOrdersByCollection[key][0]?.patient_uuid,
                    collected: true,
                    collectedBy: groupedOrdersByCollection[key][0]?.collectedBy,
                    containerDetails:
                      testsContainers[
                        groupedOrdersByCollection[key][0]?.specimenUuid
                      ],
                    mrNo: expectedSample?.mrNo,
                    priorityHigh:
                      groupedOrdersByCollection[key][0]?.priorityHigh,
                    accepted:
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          accepted: true,
                        }) || []
                      )?.length > 0
                        ? true
                        : false,
                    acceptedBy:
                      groupedOrdersByCollection[key] &&
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          accepted: true,
                        }) || []
                      )?.length > 0
                        ? (_.filter(groupedOrdersByCollection[key], {
                            accepted: true,
                          }) || [])[0].acceptedBy
                        : null,
                    acceptedAt:
                      groupedOrdersByCollection[key] &&
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          accepted: true,
                        }) || []
                      )?.length > 0
                        ? (_.filter(groupedOrdersByCollection[key], {
                            accepted: true,
                          }) || [])[0].acceptedAt
                        : null,
                    rejectedAt:
                      groupedOrdersByCollection[key] &&
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          accepted: true,
                        }) || []
                      )?.length > 0
                        ? (_.filter(groupedOrdersByCollection[key], {
                            accepted: true,
                          }) || [])[0].rejectedAt
                        : null,
                    rejected:
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          rejected: true,
                        }) || []
                      )?.length > 0
                        ? true
                        : false,
                    rejectionReason: expectedSample?.rejectionReason,
                    reCollect:
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          reCollect: true,
                          rejected: true,
                        }) || []
                      )?.length > 0
                        ? true
                        : false,
                    rejectedBy:
                      groupedOrdersByCollection[key] &&
                      (
                        _.filter(groupedOrdersByCollection[key], {
                          rejected: true,
                        }) || []
                      )?.length > 0
                        ? (_.filter(groupedOrdersByCollection[key], {
                            rejected: true,
                          }) || [])[0]?.rejectedBy
                        : null,
                    sampleUuid: groupedOrdersByCollection[key][0]?.sampleUuid,
                    patientNames:
                      groupedOrdersByCollection[key][0]?.patient_names,
                    fullCompleted: false,
                    sampleCollectionDate:
                      groupedOrdersByCollection[key][0]?.sampleCollectionDate,
                    unFormattedSampleCollectionDate:
                      groupedOrdersByCollection[key][0]
                        ?.unFormattedSampleCollectionDate,
                  },
                ];
              } else {
                // _.map(groupedOrdersByCollection[key], order => {
                //   if (order?.identifier =='107517-5-273/2021') {
                //     console.log("or", order)
                //   }
                // })
                recreatedSamples = [
                  ...recreatedSamples,
                  {
                    id: expectedSample?.id,
                    name: groupedOrdersByCollection[key][0]?.specimenName,
                    departmentName:
                      groupedOrdersByCollection[key][0]?.departmentName,
                    orders: groupedOrdersByCollection[key],
                    patient_uuid:
                      groupedOrdersByCollection[key][0]?.patient_uuid,
                    sampleIdentifier: null,
                    mrNo: expectedSample?.mrNo,
                    collected: false,
                    collectedBy: null,
                    containerDetails:
                      testsContainers[
                        groupedOrdersByCollection[key][0]?.specimenUuid
                      ],
                    acceptedBy: null,
                    sampleUuid: null,
                    priorityHigh:
                      groupedOrdersByCollection[key][0]?.priorityHigh,
                    patientNames:
                      groupedOrdersByCollection[key][0]?.patient_names,
                    fullCompleted: false,
                  },
                ];

                // console.log("recreatedSamples", recreatedSamples)
              }
            });

            allSamples = [
              ...allSamples,
              ..._.filter(recreatedSamples, (sample) => {
                if (sample?.orders?.length > 0) {
                  return sample;
                }
              }),
            ];

            return expectedSample;
          }
        }),
        (sample) => sample
      ),
    };

    // const mySamples = {}
    mySamples = _.map(
      Object.keys(_.groupBy(_.uniqBy(allSamples, "id"), "mrNo")),
      (key) => {
        return {
          mrNo: key,
          groupedOrders: _.groupBy(_.uniqBy(allSamples, "id"), "mrNo")[key],
        };
      }
    );
  });
  return _.filter(mySamples, (sample) => {
    if (visitsKeyedByMRN[sample?.mrNo]) {
      return sample;
    }
  });
}
