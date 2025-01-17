import { flatten, keyBy } from "lodash";

export function addBillStatusToOrderedItems(items, bills, encounters, visit) {
  return items?.length > 0
    ? items.map((item) => {
        const paid =
          bills?.length === 0 || visit?.isEnsured
            ? true
            : (
                bills.filter(
                  (bill) =>
                    (
                      bill?.items.filter(
                        (billItem) =>
                          billItem?.billItem?.item?.concept?.uuid ===
                          item?.concept?.uuid
                      ) || []
                    )?.length > 0
                ) || []
              )?.length > 0
            ? false
            : true;
        const matchedEncounter = (encounters.filter(
          (encounter) =>
            encounter?.orders?.length > 0 &&
            (
              encounter.orders.filter(
                (order) => order?.orderNumber === item?.order?.orderNumber
              ) || []
            )?.length > 0
        ) || [])[0];

        const observation = matchedEncounter
          ? (matchedEncounter?.obs.filter(
              (observation) =>
                observation?.concept?.uuid === item?.order?.concept?.uuid
            ) || [])[0]
          : null;
        return {
          ...item,
          paid,
          value: observation ? observation?.value?.display : null,
          remarks: observation ? observation?.comment : null,
          obsDatetime: observation ? observation?.obsDatetime : null,
        };
      })
    : [];
}

export function addBillStatusToOrders(orders, bills, visit) {
  const billedItems = flatten(
    (
      bills?.map((bill) => {
        return {
          ...bill,
          items: bill?.items?.map((item) => {
            return item?.billItem;
          }),
        };
      }) || []
    ).map((bill) => bill?.items)
  );

  return orders?.map((order) => {
    if (billedItems?.length === 0) {
      return {
        ...order,
        isAdmitted: visit?.isAdmitted,
        isEmergency: visit?.isEmergency,
        paid: true,
      };
    }

    const billItemsKeyedByOrderUuid = keyBy(
      billedItems?.map((billItem) => {
        return {
          ...billItem,
          orderUuid: billItem?.order?.uuid,
        };
      }),
      "orderUuid"
    );

    return {
      ...order,
      paid: billItemsKeyedByOrderUuid[order?.uuid] ? false : true,
      isAdmitted: visit?.isAdmitted,
      isEmergency: visit?.isEmergency,
      canBeAttended:
        !billItemsKeyedByOrderUuid[order?.uuid] ||
        visit?.isAdmitted ||
        visit?.isEmergency,
    };
  });
}
