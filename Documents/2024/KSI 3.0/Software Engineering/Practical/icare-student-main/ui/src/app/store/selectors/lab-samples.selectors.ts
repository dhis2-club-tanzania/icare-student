import { createSelector } from "@ngrx/store";
import { AppState, getRootState } from "../reducers";
import { labSamplesAdapter, LabSamplesState } from "../states";

import * as _ from "lodash";
import { generateSelectionOptions } from "src/app/shared/helpers/patient.helper";

const getLabSamplesState = createSelector(
  getRootState,
  (state: AppState) => state.labSamples
);

export const {
  selectAll: getAllLabSamples,
  selectEntities: getAllLabSampleEntities,
} = labSamplesAdapter.getSelectors(getLabSamplesState);

export const getLabSamplesLoadedState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.loaded
);

export const getLabSampleLoadingState = createSelector(
  getLabSamplesState,
  (state) => {
    return state.loading;
  }
);

export const getAllCollectedLabSamples = createSelector(
  getAllLabSamples,
  (samples) => {
    return _.filter(samples, { collected: true });
  }
);

export const getCollectingLabSampleState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.collectingSample
);

export const getSettingLabSampleStatusState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.settingLabSampleStatus
);

export const getSavingLabTestResultsState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.savingResults
);

export const getSavingLabTestResultsStatusState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.savingStatus
);

export const getMarkingForReCollectionState = createSelector(
  getLabSamplesState,
  (state: LabSamplesState) => state.markingReCollect
);

export const getAllAcceptedLabSamples = createSelector(
  getAllLabSamples,
  (samples) =>
    _.filter(samples, { collected: true, accepted: true, rejected: false })
);

export const getAllRejectedLabSamples = createSelector(
  getAllLabSamples,
  (samples, props) => {
    return _.filter(samples, (sample) => {
      if (
        sample?.collected &&
        !sample?.reCollect &&
        sample?.rejected &&
        sample?.searchingText
          .toLowerCase()
          .indexOf(props?.searchingText.toLowerCase()) > -1
      ) {
        return sample;
      }
    });
  }
);

export const getAllRejectedLabSamplesAndMarkedForReCollection = createSelector(
  getAllLabSamples,
  (samples, props) => {
    return _.filter(samples, (sample) => {
      if (
        sample?.collected &&
        sample?.reCollect &&
        sample?.rejected &&
        sample?.searchingText
          .toLowerCase()
          .indexOf(props?.searchingText.toLowerCase()) > -1
      ) {
        return sample;
      }
    });
  }
);

export const getAllLabSamplesWaitingAcceptanceNotGrouped = createSelector(
  getAllLabSamples,
  (samples) => {
    return _.filter(samples, {
      collected: true,
      accepted: false,
      rejected: false,
    });
  }
);

export const getAllLabSamplesWaitingAcceptance = createSelector(
  getAllLabSamples,
  (samples, props) => {
    // _.map(samples, (sample) => {
    //   console.log(JSON.stringify(sample?.orders));
    // });
    const waitingAcceptance = _.filter(samples, (sample) => {
      // console.log("sample :: ", sample, "  dept :: ", sample?.departmentName)
      if (
        sample?.collected &&
        !sample?.accepted &&
        !sample?.rejected &&
        sample?.searchingText
          .toLowerCase()
          .indexOf(props?.searchingText.toLowerCase()) > -1 &&
        sample?.departmentName
          ?.toLowerCase()
          ?.indexOf(props?.department?.toLowerCase() || "") > -1
      ) {
        return sample;
      }
    });
    const withFilteredOrders = _.groupBy(
      _.orderBy(
        _.filter(
          _.map(waitingAcceptance, (sample) => {
            return {
              ...sample,
              orders: _.uniqBy(
                _.filter(_.orderBy(sample?.orders, ["order_date"], ["asc"]), {
                  collected: true,
                }),
                "concept_uuid"
              ),
              priority: sample?.priorityHigh ? 0 : 1,
            };
          }),
          (sample) => sample?.orders?.length > 0
        ),
        ["priority"],
        ["asc"]
      ),
      "mrNo"
    );
    const formattedSamples = _.map(Object.keys(withFilteredOrders), (key) => {
      let countOfOrdersForGroupedSamples = 0;

      withFilteredOrders[key] = _.uniqBy(
        withFilteredOrders[key],
        "sampleIdentifier"
      );

      // console.log("before the map",withFilteredOrders[key])

      _.map(withFilteredOrders[key], (sample) => {
        countOfOrdersForGroupedSamples += sample?.orders?.length;
      });

      // console.log("the samples :: ", withFilteredOrders[key]);

      return {
        mrNo: key,
        samples: withFilteredOrders[key],
        rowSpan: countOfOrdersForGroupedSamples,
      };
    });
    return formattedSamples;
  }
);

export const getLabSamplesWaitingToFeedResults = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const waitingToFeedResults = _.filter(samples, (sample) => {
      if (
        sample?.collected &&
        sample?.accepted &&
        !sample?.rejected &&
        sample?.searchingText
          .toLowerCase()
          .indexOf(props?.searchingText.toLowerCase()) > -1 &&
        sample?.departmentName
          ?.toLowerCase()
          ?.indexOf(props?.department?.toLowerCase() || "") > -1
      ) {
        return sample;
      }
    });
    const withFilteredOrders = _.groupBy(
      _.filter(
        _.map(waitingToFeedResults, (sample) => {
          return {
            ...sample,
            orders: _.filter(
              _.map(
                _.uniqBy(
                  _.orderBy(
                    _.filter(sample?.orders, (order) => {
                      if (
                        order?.allocations &&
                        order?.allocations?.length > 0
                      ) {
                        return order;
                      }
                    }),
                    ["order_date"],
                    ["asc"]
                  ),
                  "concept_uuid"
                ),
                (order) => {
                  if (order?.collected) {
                    return {
                      ...order,
                      hasValue:
                        getAllAlocationsWithResults(order?.allocations)
                          ?.length == order?.allocations?.length
                          ? true
                          : false,
                      firstSignOff:
                        getAllocationsWithFirstSignOff(order?.allocations)
                          ?.length == order?.allocations?.length
                          ? true
                          : false,
                      secondSignOff:
                        getAllocationsWithSecondSignOff(order?.allocations)
                          ?.length == order?.allocations?.length
                          ? true
                          : false,
                    };
                  }
                }
              ),
              (formattedOrder) => formattedOrder
            ),
            atLeastOneOrderHasResults:
              getCountOfOrdersWithFilledResults(
                _.filter(sample?.orders, { collected: true })
              ) > 0
                ? true
                : false,
            allOrdersHaveResults:
              getCountOfOrdersWithFilledResults(
                _.filter(sample?.orders, { collected: true }) || []
              ) == (_.filter(sample?.orders, { collected: true }) || [])?.length
                ? true
                : false,
          };
        }),
        (sample) => sample?.orders?.length > 0
      ),
      "mrNo"
    );

    const formattedSamples = _.map(Object.keys(withFilteredOrders), (key) => {
      withFilteredOrders[key] = _.uniqBy(
        withFilteredOrders[key],
        "sampleIdentifier"
      );

      let countOfOrdersForGroupedSamples = 0;
      _.map(withFilteredOrders[key], (sample) => {
        countOfOrdersForGroupedSamples += sample?.orders?.length;
      });

      return {
        mrNo: key,
        samples: withFilteredOrders[key],
        rowSpan: countOfOrdersForGroupedSamples,
      };
    });
    return formattedSamples;
  }
);

function getAllAlocationsWithResults(allocations) {
  return _.filter(allocations, (allocation) => {
    if (allocation?.results?.length > 0) {
      return allocation;
    }
  });
}

function getAllocationsWithFirstSignOff(allocations) {
  return _.filter(allocations, (allocation) => {
    if (
      (_.filter(allocation?.statuses, { status: "APPROVED" }) || [])?.length > 0
    ) {
      return allocation;
    }
  });
}

function getAllocationsWithSecondSignOff(allocations) {
  return _.filter(allocations, (allocation) => {
    if (
      (_.filter(allocation?.statuses, { status: "APPROVED" }) || [])?.length > 1
    ) {
      return allocation;
    }
  });
}

function getCountOfOrdersWithFilledResults(orders) {
  let count = 0;
  _.map(orders, (order) => {
    if (order?.allocations[0]?.results?.length > 0) {
      count++;
    }
  });
  return count;
}

export const getLabSamplesForShowingTrackingDetails = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const collectedSamples = _.filter(samples, (sample) => {
      if (
        sample?.collected &&
        sample?.searchingText
          .toLowerCase()
          .indexOf(props?.searchingText.toLowerCase()) > -1 &&
        sample?.departmentName
          ?.toLowerCase()
          ?.indexOf(props?.department?.toLowerCase() || "") > -1
      ) {
        return sample;
      }
    });
    const withFilteredOrders = _.groupBy(
      _.filter(
        _.map(collectedSamples, (sample) => {
          return {
            ...sample,
            orders: _.filter(sample?.orders, { collected: true }),
          };
        }),
        (sample) => sample?.orders?.length > 0
      ),
      "mrNo"
    );
    const formattedSamples = _.map(Object.keys(withFilteredOrders), (key) => {
      return {
        mrNo: key,
        samples: withFilteredOrders[key],
      };
    });
    return formattedSamples;
  }
);

export const getWorkListFromLabSamples = createSelector(
  getAllLabSamples,
  (samples, props) => {
    let worklist = [];
    _.map(_.filter(samples, { accepted: true, collected: true }), (sample) => {
      worklist = [
        ...worklist,
        ..._.map(sample?.orders, (order) => {
          return {
            ...order,
            acceptedByUuid: order?.acceptedBy?.uuid,
            searchingText:
              order?.concept?.display +
              "-" +
              order?.departmentName +
              "-" +
              order?.specimenName +
              "-" +
              order?.sampleIdentifier +
              "-" +
              order?.identifier,
          };
        }),
      ];
    });
    return _.filter(worklist, {
      acceptedByUuid: props?.userUuid,
    });
  }
);

export const getSampledOrdersToTrackBySampleIndentifier = createSelector(
  getAllLabSamples,
  (samples, props) => {
    let orders = [];
    samples = _.map(
      _.filter(samples, { sampleIdentifier: props?.sampleIdentifier }),
      (sample) => {
        orders = [
          ...orders,
          ..._.map(sample?.orders, (groupedSampleOrder) => {
            return {
              ...groupedSampleOrder,
              allocations: _.map(
                groupedSampleOrder?.allocations,
                (sampleOrderAllocation) => {
                  return {
                    ...sampleOrderAllocation,
                    results: _.map(
                      sampleOrderAllocation?.results,
                      (orderAllocationResult) => {
                        return {
                          ...orderAllocationResult,
                          value:
                            groupedSampleOrder?.concept?.datatype?.display ==
                            "Coded"
                              ? _.filter(
                                  groupedSampleOrder?.concept?.answers,
                                  (answer) => {
                                    return answer?.uuid ==
                                      orderAllocationResult?.value
                                      ? true
                                      : false;
                                  }
                                )[0]["display"]
                              : orderAllocationResult?.value,
                        };
                      }
                    ),
                  };
                }
              ),
            };
          }),
        ];
      }
    );
    return orders;
  }
);

export const getSampledOrdersBySampleIndentifier = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const filteredOrders = (_.filter(samples, {
      collected: true,
      accepted: true,
      rejected: false,
      sampleIdentifier: props?.sampleIdentifier,
    }) || [])[0]?.orders;
    // console.log('filteredOrders', filteredOrders);
    // const formattedOrders = _.map(filteredOrders, (order) => {
    //   if (order?.concept?.setMembers?.length > 0) {
    //     return {
    //       ...order,
    //       concept: formulateConcept(order?.concept),
    //     };
    //   } else {
    //     return order;
    //   }
    // });
    // console.log('formattedOrders', formattedOrders);
    return _.uniqBy(filteredOrders, "concept_uuid");
  }
);

function formulateConcept(concept) {
  return {
    ...concept,
    setMembers: _.map(concept?.setMembers, (setMember) => {
      return {
        ...setMember,
        selectionOptions:
          setMember?.hiNormal && setMember?.lowNormal
            ? generateSelectionOptions(
                setMember?.lowNormal,
                setMember?.hiNormal
              )
            : [],
      };
    }),
  };
}

export const getLabSampleBySampleIndentifier = createSelector(
  getAllLabSamples,
  (samples, props) => {
    return (_.filter(samples, {
      collected: true,
      accepted: true,
      rejected: false,
      sampleIdentifier: props?.sampleIdentifier,
    }) || [])[0];
  }
);

export const getAllFullCompletedLabSamples = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const completedSamples =
      _.filter(samples, (sample) => {
        if (
          sample?.collected &&
          sample?.accepted &&
          !sample?.rejected &&
          sample?.searchingText
            .toLowerCase()
            .indexOf(props?.searchingText.toLowerCase()) > -1 &&
          sample?.departmentName
            ?.toLowerCase()
            ?.indexOf(props?.department?.toLowerCase() || "") > -1
        ) {
          return sample;
        }
      }) || [];

    let fullCompletedSamples = [];

    _.map(completedSamples, (sample) => {
      _.map(sample?.orders, (order) => {
        if (
          (
            _.filter(order?.allocations[0]?.statuses, { status: "APPROVED" }) ||
            []
          )?.length > 1
        ) {
          // console.log('eeeeeeeeeeee', sample);
          fullCompletedSamples = [...fullCompletedSamples, sample];
        }
      });
    });
    return fullCompletedSamples;
  }
);

export const getAllFullCompletedLabSamplesGroupedByMRN = createSelector(
  getAllLabSamples,
  (samples, props) => {
    console.log("SELECTOR SAMPLES ::", samples);

    const completedSamples =
      _.filter(samples, (sample) => {
        if (
          sample?.collected &&
          sample?.accepted &&
          !sample?.rejected &&
          sample?.searchingText
            .toLowerCase()
            .indexOf(props?.searchingText.toLowerCase()) > -1 &&
          sample?.departmentName
            ?.toLowerCase()
            ?.indexOf(props?.department?.toLowerCase() || "") > -1
        ) {
          return sample;
        }
      }) || [];

    let fullCompletedSamples = [];

    _.map(completedSamples, (sample) => {
      _.map(sample?.orders, (order) => {
        if (
          (
            _.filter(order?.allocations[0]?.statuses, { status: "APPROVED" }) ||
            []
          )?.length > 1
        ) {
          // console.log('eeeeeeeeeeee', sample);
          fullCompletedSamples = [...fullCompletedSamples, sample];
        }
      });
    });
    const grouped = _.groupBy(fullCompletedSamples, "mrNo");
    return _.map(Object.keys(grouped), (mrNo) => {
      return {
        mrNo: mrNo,
        patientNames: grouped[mrNo][0]?.patientNames,
        samples: grouped[mrNo],
      };
    });
  }
);

export const getPatientCollectedLabSamplesDelete = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const patientSamples =
      _.filter(samples, {
        collected: true,
        rejected: false,
        patient_uuid: props?.patient_uuid,
      }) || [];

    return _.filter(
      _.map(patientSamples, (sample) => {
        return {
          ...sample,
          orders: _.uniqBy(
            _.filter(sample?.orders, { collected: true }),
            "concept_uuid"
          ),
        };
      }),
      (sample) => sample?.orders?.length > 0
    );
  }
);

export const getPatientsSamplesToCollectDelete = createSelector(
  getAllLabSamples,
  (samples, props) => {
    const patientSamples = _.filter(samples, (sample) => {
      if (!sample?.collected && sample?.patient_uuid == props?.patient_uuid) {
        return sample;
      }
    });

    // console.log("patientSamples", patientSamples)

    // Extract tests not collected from collected samples
    let samplesWithOrdersNotCollected = [];
    _.map(
      _.filter(samples, { collected: true, patient_uuid: props?.patient_uuid }),
      (sample) => {
        const ordersNotCollected = _.filter(sample?.orders, {
          collected: false,
        });
        if (ordersNotCollected?.length > 0) {
          samplesWithOrdersNotCollected = [
            ...samplesWithOrdersNotCollected,
            {
              ...sample,
              orders: ordersNotCollected,
              reCollect: true,
            },
          ];
        }
      }
    );
    const formattedPatientSamples = _.map(patientSamples, (sample) => {
      return {
        ...sample,
        orders: _.uniqBy(
          _.filter(
            _.map(sample?.orders, (order) => {
              return {
                ...order,
                paymentType: order?.p_category + " - " + order?.p_sub_category,
              };
            }),
            (order) => order
          ),
          "concept_uuid"
        ),
      };
    });

    return _.filter(
      [...formattedPatientSamples, ...samplesWithOrdersNotCollected],
      (sample) => {
        if (sample?.orders?.length > 0) {
          return sample;
        }
      }
    );
  }
);

export const getLabSamplesToReCollect = createSelector(
  getAllLabSamples,
  (samples) => {
    // Get rejected sample and recollect
    let rejectedSamplesForReCollection = [];
    _.map(
      _.filter(samples, {
        reCollect: true,
      }),
      (sample) => {
        const ordersRejectedAndHasToBeReCollected = _.filter(sample?.orders, {
          collected: true,
          rejected: true,
        });
        if (ordersRejectedAndHasToBeReCollected?.length > 0) {
          rejectedSamplesForReCollection = [
            ...rejectedSamplesForReCollection,
            {
              ...sample,
              orders: ordersRejectedAndHasToBeReCollected,
              reCollect: true,
            },
          ];
        }
      }
    );

    return rejectedSamplesForReCollection;
  }
);

export const getCollectedLabSamplesKeyedByMRN = createSelector(
  getAllLabSamples,
  (samples) => {
    const collectedSamples = _.filter(samples, { collected: true });
    return _.groupBy(collectedSamples, "mrNo");
  }
);

export const getCollectedLabSamplesKeyedBySampleIdentifier = createSelector(
  getAllLabSamples,
  (samples) => {
    const collectedSamples = _.filter(samples, { collected: true });
    return _.groupBy(collectedSamples, "sampleIdentifier");
  }
);
