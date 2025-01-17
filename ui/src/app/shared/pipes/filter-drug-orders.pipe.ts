import { Pipe, PipeTransform } from "@angular/core";
import { keyBy } from "lodash";

@Pipe({
  name: "filterDrugOrders",
})
export class FilterDrugOrdersPipe implements PipeTransform {
  transform(
    drugOrders: any[],
    status: string,
    statusesToExcluse: any[],
    noStatus?: boolean
  ): any[] {
    let noStatusList = [];
    const previousOrders =
      (
        drugOrders?.filter((drugOrder) => drugOrder?.previousOrder?.uuid) || []
      )?.map((order) => order?.previousOrder) || [];
    const keyedPreviousOrder = keyBy(previousOrders, "uuid");
    if (status == "NON") {
      return (
        drugOrders?.filter(
          (drugOrder) =>
            drugOrder?.statuses?.length === 0 &&
            !keyedPreviousOrder[drugOrder?.uuid]
        ) || []
      );
    }
    if (noStatus) {
      noStatusList =
        drugOrders?.filter((drugOrder) => drugOrder?.statuses?.length === 0) ||
        [];
    }

    if (!status) {
      return drugOrders;
    }

    let statusesToExcludeCheck = {};
    statusesToExcluse.forEach((status) => {
      statusesToExcludeCheck[status] = status;
    });
    return [
      ...noStatusList,
      ...(drugOrders?.filter(
        (drugOrder) =>
          (
            drugOrder?.statuses?.filter(
              (orderStatus) =>
                orderStatus?.status?.toLowerCase() === status?.toLowerCase()
            ) || []
          )?.length > 0
      ) || []),
    ]?.filter(
      (drugOrder) =>
        (
          drugOrder?.statuses?.filter(
            (drugStatus) => statusesToExcludeCheck[drugStatus?.status]
          ) || []
        )?.length === 0 &&
        (drugOrder?.previousOrder?.uuid || status === "EMPTY")
    );
  }
}
