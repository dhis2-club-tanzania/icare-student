import { orderBy, map, filter, flatten, uniqBy, groupBy } from "lodash";

export function mergeTestAllocations(allocations: any): any {
  const formattedTestAllocations = allocations?.map((allocation) => {
    return {
      ...allocation,
      parameterUuid: allocation?.concept?.uuid,
    };
  });
  const groupedAllocations = groupBy(formattedTestAllocations, "parameterUuid");
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

export function getAuthorizationDetailsByOrder(order: any, isLIS?: boolean) {
  const approvedAllocations =
    order?.testAllocations?.filter(
      (allocation) =>
        (
          allocation?.statuses?.filter(
            (status) =>
              (((status?.status === "APPROVED" ||
                status?.status === "AUTHORIZED") &&
                isLIS) ||
                (!isLIS &&
                  (status?.remarks?.toLowerCase()?.indexOf("second_approval") >
                    -1 ||
                    status?.status === "AUTHORIZED"))) &&
              status?.timestamp
          ) || []
        )?.length > 0
    ) || [];
  const allocationStatuses = uniqBy(
    approvedAllocations?.map((allocation) => {
      return {
        ...allocation,
        statuses:
          allocation?.statuses
            ?.map((status) => {
              return {
                ...status,
                ...status?.user,
                name: status?.user?.display?.split(" (")[0],
                allocation: allocation,
              };
            })
            ?.filter(
              (status) =>
                status?.status === "APPROVED" || status?.status === "AUTHORIZED"
            ) || [],
      };
    }),
    "name"
  );
  return allocationStatuses;
}

export function getAuthorizationDetails(sample) {
  const approvedAllocations = flatten(
    sample?.orders?.map((order) => {
      return (
        order?.testAllocations?.filter(
          (allocation) =>
            (
              allocation?.statuses?.filter(
                (status) =>
                  status?.timestamp &&
                  (status?.status === "AUTHORIZED" ||
                    status?.category === "RESULT_AUTHORIZATION")
              ) || []
            )?.length > 0
        ) || []
      );
    })
  );
  const allocationStatuses = uniqBy(
    flatten(
      approvedAllocations?.map((allocation) => {
        return (
          allocation?.statuses?.filter((status) => status?.timestamp) || []
        )?.map((status) => {
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

export function createSearchingText(
  sample,
  department?: any,
  specimenSource?: any
): string {
  return (
    sample?.label +
    "-" +
    sample?.patient?.givenName +
    sample?.patient?.middleName +
    sample?.patient?.familyName +
    department?.name +
    specimenSource?.specimenName +
    sample?.patient?.identifiers[0]?.id +
    map(sample?.orders, (order) => {
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

export function getOrdersWithResults(orders) {
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

export function keyLevelTwoConceptSetMembers(members) {
  let testToContainers = {};
  map(members, (member) => {
    map(member?.setMembers, (container) => {
      testToContainers[container?.uuid] = {
        ...member,
      };
    });
  });
  return testToContainers;
}

export function formatResults(results) {
  // console.log(results);
  return orderBy(
    map(results, (result) => {
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
  return filter(statuses, (status) => {
    if (status?.status != "APPROVED" && status?.status != "REJECTED") {
      return status;
    }
  });
}
