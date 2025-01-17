import { orderBy } from 'lodash';

export function addBillStatusOnBedOrders(orders, bills, visit) {
  return orderBy(
    orders.map((bedOrder) => {
      return {
        ...bedOrder?.order,
        dueDateAndTime: new Date(
          new Date(bedOrder?.order?.dateActivated).getTime() +
            60 * 60 * 24 * 1000
        ),
        paid:
          bills?.length == 0 || visit?.isEnsured
            ? true
            : (
                bills.filter(
                  (bill) =>
                    (
                      bill?.items.filter(
                        (billItem) =>
                          billItem?.billItem?.item?.concept?.uuid ===
                          bedOrder?.order?.concept?.uuid
                      ) || []
                    )?.length > 0
                ) || []
              )?.length > 0
            ? false
            : true,
      };
    }),
    ['dateActivated'],
    ['desc']
  );
}

export function getCountOfUnPaidBedOrders(bedOrders) {
  return (bedOrders.filter((bedOrder) => !bedOrder?.paid) || [])?.length;
}
