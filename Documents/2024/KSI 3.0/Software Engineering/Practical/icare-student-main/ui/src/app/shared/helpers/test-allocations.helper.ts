import * as _ from 'lodash';

export function formatTestsAllocations(
  order,
  currentAllocation,
  resultResponse
) {
  // console.log(order);
  // console.log(currentAllocation);
  // console.log(resultResponse);
  let allocations = [];
  _.map(order?.testAllocations, (allocation) => {
    allocations = [...allocations, allocation];
  });
  let matchedAllocationIndex = null;
  _.each(allocations, (allocation: any, index) => {
    if (allocation.allocationUuid === currentAllocation?.allocationUuid) {
      matchedAllocationIndex = index;
    }
  });

  allocations[matchedAllocationIndex] = {
    results: _.orderBy(
      [
        {
          ...resultResponse,
          resultsFedBy: {
            uuid: resultResponse?.creator?.uuid,
            name: resultResponse?.creator?.display.split('(')[0],
            display: resultResponse?.creator?.display.split('(')[0],
          },
          value: resultResponse?.valueText
            ? resultResponse?.valueText
            : resultResponse?.valueCoded
            ? resultResponse?.valueCoded?.uuid
            : (resultResponse?.valueNumeric).toString(),
        },
        ...order?.testAllocations[matchedAllocationIndex]?.results,
      ],
      ['dateCreated'],
      ['asc']
    ),
    statuses: order?.testAllocations[matchedAllocationIndex]?.statuses,
    resultsCommentsStatuses: _.orderBy(
      _.filter(
        order?.testAllocations[matchedAllocationIndex]?.statuses,
        (status) => {
          if (status?.status != 'APPROVED' && status?.status != 'REJECTED') {
            return status;
          }
        }
      ),
      ['timestamp'],
      ['desc']
    ),
    allocationUuid: currentAllocation?.allocationUuid,
    concept: resultResponse?.concept
  };
  return allocations;
}

export function formatTestAllocationsAfterApproval(
  order,
  currentAllocation,
  response
) {
  let allocations = [];
  _.map(order?.testAllocations, (allocation) => {
    allocations = [...allocations, allocation];
  });
  let allocationIndex = null;
  let allocationStatuses = [];

  _.each(allocations, (allocation: any, index) => {
    if (allocation.allocationUuid === currentAllocation?.allocationUuid) {
      allocationIndex = index;
      allocationStatuses = [...allocationStatuses, ...allocation?.statuses];
    }
  });

  allocationStatuses = [...allocationStatuses, response];

  allocations[allocationIndex] = {
    ...allocations[allocationIndex],
    statuses: _.orderBy(allocationStatuses, ['timestamp'], ['desc']),
    firstSignOff:
      allocationStatuses?.length > 0 &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]?.status ==
        'APPROVED'
        ? true
        : false,
    secondSignOff:
      allocationStatuses?.length > 0 &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]?.status ==
        'APPROVED' &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[1]?.status ==
        'APPROVED'
        ? true
        : false,
    rejected:
      allocationStatuses?.length > 0 &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]?.status ==
        'REJECTED'
        ? true
        : false,
    rejectionStatus:
      allocationStatuses?.length > 0 &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]?.status ==
        'REJECTED'
        ? _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]
        : null,
    fullCompleted:
      allocationStatuses?.length > 0 &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[0]?.status ==
        'APPROVED' &&
      _.orderBy(allocationStatuses, ['timestamp'], ['desc'])[1]?.status ==
        'APPROVED'
        ? true
        : false,
    resultsCommentsStatuses: _.orderBy(
      _.filter(allocationStatuses, (status) => {
        if (status?.status != 'APPROVED' && status?.status != 'REJECTED') {
          return status;
        }
      }),
      ['timestamp'],
      ['desc']
    ),
    container: order?.containerDetails,
    allocationUuid: currentAllocation?.allocationUuid,
  };
  return allocations;
}

export function formatAllocationResponsesByOrdersAfterAcceptingSample(
  responses,
  orders
) {
  let formattedOrders = _.map(orders, (order) => {
    let allocations = [];
    _.map(responses, (response) => {
      if (response?.order?.concept?.uuid == order?.order?.concept?.uuid || response?.concept?.uuid == order?.order?.concept?.uuid) {
        allocations = [...allocations, ...response?.allocations];
      }
    });
    return {
      ...order,
      testAllocations: allocations,
    };
  });
  return formattedOrders;
}
