import { flatten,groupBy, omit } from "lodash";

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


export function addBillStatusToOrders(orders, bills, visit){
    bills = bills?.map((bill) => {
      return {
        ...bill,
        items: bill?.items?.map((item) => {
          return item?.billItem;
        }),
      };
    });
  
    return orders?.map((order) => {
      if (bills?.length === 0 || visit?.isEnsured || visit?.isEmergency || !visit?.isAdmitted){
        return {
          ...order,
          paid: true
        }
      }
      
      let tempOrder = order
      bills?.map((bill) => {
        bill?.items?.map((item) => {
          tempOrder = {
            ...order,
            paid: item?.item?.concept?.uuid !== order?.concept?.uuid ? true : false
          }
        })
      })

      return tempOrder
    })
}
