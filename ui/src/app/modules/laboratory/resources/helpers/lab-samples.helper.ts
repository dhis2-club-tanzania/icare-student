import * as _ from "lodash";

export function getAllLabTestsForCurrentUser(samples, currentUser) {
  let formattedOrders = [];
  _.each(samples, (sample) => {
    /**
     * TODO: include user
     */
    if (
      sample?.user?.uuid == currentUser?.uuid &&
      sample?.status == "ACCEPTED"
    ) {
      _.each(sample?.orders, (order) => {
        // The order should be assigned to a person
        if (order?.technician?.uuid) {
          formattedOrders = [
            ...formattedOrders,
            {
              ...order,
              sampleId: sample?.id,
              sampleUuid: sample?.uuid,
              specimenSourceName: sample?.specimenSourceName,
              specimenSourceUuid: sample?.specimenSourceUuid,
              mrNo: sample?.mrNo,
              patient: sample?.patient,
              user: order?.technician,
              priority: sample?.priority,
              sampleStatus: sample?.status,
              sample: sample,
            },
          ];
        }
      });
    } else if (sample?.status == "ACCEPTED") {
      _.each(sample?.orders, (order) => {
        if (order?.technician?.uuid == currentUser?.uuid) {
          formattedOrders = [
            ...formattedOrders,
            {
              ...order,
              sampleId: sample?.id,
              sampleUuid: sample?.uuid,
              specimenSourceName: sample?.specimenSourceName,
              specimenSourceUuid: sample?.specimenSourceUuid,
              mrNo: sample?.mrNo,
              patient: sample?.patient,
              user: order?.technician,
              priority: sample?.priority,
              sampleStatus: sample?.status,
              sample: sample,
            },
          ];
        }
      });
    } else {
    }
  });
  return formattedOrders;
}

export function formatLabSamples(samples, status?) {
  return status
    ? _.filter(
        _.map(samples, (sample) => {
          return {
            id: sample?.id,
            uuid: sample?.uuid,
            specimenSourceName: sample?.specimenSourceName,
            specimenSourceUuid: sample?.specimenSourceUuid,
            mrNo: sample?.mrNo,
            patient: sample?.patient,
            orders: sample?.orders,
            priority: sample?.priority ? "HIGH" : "None",
            allocation: sample?.allocation,
            status: sample?.status,
            comments: sample?.comments,
            user: sample?.user,
          };
        }),
        { status: status }
      )
    : _.map(samples, (sample) => {
        return {
          id: sample?.id,
          uuid: sample?.uuid,
          specimenSourceName: sample?.specimenSourceName,
          specimenSourceUuid: sample?.specimenSourceUuid,
          mrNo: sample?.mrNo,
          patient: sample?.patient,
          orders: sample?.orders,
          priority: sample.priority ? "Urgent" : "Routine",
          allocation: sample?.allocation,
          status: sample?.status,
          comments: sample?.comments,
          user: sample?.user,
        };
      });
}

export function getSamplesWithTestsHavingSpecificSignOff(samples, signOff) {
  const filteredByOrdersSamples = _.map(samples, (sample) => {
    return {
      id: sample?.id,
      uuid: sample?.uuid,
      specimenSourceName: sample.specimenSourceName,
      specimenSourceUuid: sample.specimenSourceUuid,
      mrNo: sample?.mrNo,
      patient: sample?.patient,
      orders: getOrdersWithSpecificSignOff(sample?.orders, signOff),
      priority: sample?.priority ? "Urgent" : "Routine",
      allocation: sample?.allocation,
      status: sample?.status,
      comments: sample?.comments,
      user: sample?.user,
    };
  });
  return _.filter(filteredByOrdersSamples, (sample) => {
    if (sample.orders.length > 0) {
      return sample;
    }
  });
}
function getOrdersWithSpecificSignOff(orders, signOff) {
  return _.filter(orders, (order) => {
    if (order.signOff && order.signOff == signOff) {
      return order;
    }
  });
}

export function getSamplesWithNoStatus(samples) {
  const filteredSamples = _.filter(samples, (sample) => {
    if (!sample.status) {
      return sample;
    }
  });
  return filteredSamples;
}

function getmrNo(identifiers) {
  const matchedIdentifier = (_.filter(identifiers, (identifier) => {
    if (
      identifier?.identifierType?.name == "MRN" ||
      identifier?.identifierType?.display == "MRN"
    ) {
      return identifier;
    }
  }) || [])[0];
  if (matchedIdentifier) {
    return matchedIdentifier?.id;
  } else {
    return "";
  }
}

export function getLabSamplesWithNoStatus(samples) {
  return _.filter(samples, (sample) => {
    if (!sample.hasOwnProperty("status") || !sample?.status) {
      return sample;
    }
  });
}

export function groupSamplesBymRNo(samples) {
  return _.map(Object.keys(_.groupBy(samples, "mrNo")), (key) => {
    return {
      mrNo: key,
      samples: _.groupBy(samples, "mrNo")[key],
    };
  });
}

export function addSampleStatusToSample(sample, statusCreateResponse) {
  return {
    ...sample,
    status: statusCreateResponse?.status,
    user: statusCreateResponse.user,
    comments: statusCreateResponse?.remarks,
  };
}

export function addResultToOrderInTheSample(sample, resultDetails) {
  /**TODO: Refactor  how to handle multiple results and allocations */
  const orders = _.map(sample.orders, (order) => {
    if (order?.concept?.uuid == resultDetails?.concept.uuid) {
      let testAllocation = order?.testAllocations[0];
      testAllocation = { ...testAllocation, results: [resultDetails] };
      return {
        ...order,
        testAllocations: [testAllocation],
      };
    } else {
      return order;
    }
  });
  return {
    ...sample,
    orders: orders,
  };
}

export function addTestAllocationDetailsToSample(sample, allocationResponse) {
  const orders = _.map(sample.orders, (order) => {
    if (order.orderNumber == allocationResponse?.order?.orderNumber) {
      return {
        ...order,
        technician: allocationResponse?.technician,
        sample: allocationResponse?.sample,
      };
    } else {
      return order;
    }
  });
  return {
    ...sample,
    orders: orders,
  };
}

export function setSignOffToTestInTheSample(
  sample,
  signOffDetails,
  allocationUuid
) {
  let orders = [];
  _.map(sample.orders, (order) => {
    if (order?.testAllocations[0]?.uuid == allocationUuid) {
      let testAllocation = order?.testAllocations[0];
      testAllocation = {
        ...testAllocation,
        statuses: [...testAllocation?.statuses, signOffDetails],
      };
      orders = [
        ...orders,
        {
          ...order,
          testAllocations: [testAllocation],
        },
      ];
    } else {
      orders = [...orders, order];
    }
  });
  return {
    ...sample,
    orders: orders,
  };
}

export function setContaincerToTestInTheSample(
  sample,
  testsAllocationDetails,
  orderUuid
) {
  const orders = _.map(sample.orders, (order) => {
    if (order?.uuid == orderUuid) {
      return {
        ...order,
        testAllocations: [testsAllocationDetails],
      };
    } else {
      return order;
    }
  });
  return {
    ...sample,
    orders: orders,
  };
}

export function mergeSampleCreationResponseAndGroupOrders(
  sample,
  sampleCreateResponse
) {
  return {
    id: sample?.id,
    uuid: sampleCreateResponse?.uuid,
    orders: formatOrders(sample?.orders, sampleCreateResponse),
    patient: sample?.patient,
    priority: sample?.priority,
    mrNo: sample?.mrNo,
    sampleIdentifier: sample?.id,
    specimenSourceName: sample?.specimenSourceName,
    specimenSourceUuid: sample?.specimenSourceUuid,
    visit: sample?.visit,
    status: (sampleCreateResponse?.statuses || [])[0]?.status,
    user: null,
    comments: null,
  };
}

function formatOrders(orders, sample) {
  return _.map(orders, (order) => {
    return {
      ...order,
      testAllocations: [],
      sample: sample,
      user: null,
    };
  });
}

export function getCompletedOrders(orders, isLIS?: boolean) {
  return (
    _.filter(orders, (order) => {
      const testAllocationsWithResults = getTestAllocationsWithResults(
        order?.testAllocations
      );
      if (
        testAllocationsWithResults?.length > 0 &&
        order?.authorizationInfo?.length > 0
      ) {
        return order;
      }
    }) || []
  );
}

export function getTestAllocationsWithResults(allocations) {
  return _.uniqBy(
    allocations?.map((allocation) => {
      return {
        ...allocation,
        conceptUuid: allocation?.concept?.uuid,
        hasResult: allocation?.results?.length > 0,
      };
    }) || [],
    "conceptUuid"
  )?.filter((allocation) => allocation?.hasResult);
}

export function getLabOrdersNotSampled(labOrders, sampledOrders, paidItems) {
  let ordersNotSampled = [];
  _.each(labOrders, (labOrder) => {
    if (
      (
        _.filter(sampledOrders, (sampledOrder) => {
          if (sampledOrder?.order?.uuid === labOrder?.uuid) {
            return sampledOrder?.order;
          }
        }) || []
      )?.length > 0
    ) {
    } else {
      ordersNotSampled = [
        ...ordersNotSampled,
        {
          ...labOrder,
          paid: paidItems[labOrder?.concept?.display] ? true : false,
        },
      ];
    }
  });
  return _.uniqBy(ordersNotSampled, "uuid");
}
