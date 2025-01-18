import { Pipe, PipeTransform } from "@angular/core";
import { filter } from "lodash";

@Pipe({
  name: "filterBy",
})
export class FilterByPipe implements PipeTransform {
  transform(
    arrOfItems: any[],
    searchText: string,
    key?: string,
    currentLocation?: any,
    service?: string
  ): any[] {
    if (service && service === "LABS") {
      return arrOfItems;
    }
    if (service && service === "LABSCOMPLETED") {
      return (
        arrOfItems.filter(
          (item) =>
            item.labOrders.length > 0 &&
            item.labOrders.filter((subItem) => subItem.orderHasResult)
        ) || []
      );
    }
    if (!arrOfItems) {
      return [];
    }

    if (!searchText && !currentLocation) {
      return arrOfItems;
    }

    searchText = searchText?.toLowerCase();
    return arrOfItems.filter((item: any) => {
      if (typeof item === "string") {
        return item?.toLowerCase()?.includes(searchText);
      } else if (typeof item === "number") {
        return item?.toString()?.toLowerCase()?.includes(searchText);
      } else if (key && currentLocation) {
        return (
          (
            filter(currentLocation?.attributes, (attribute) => {
              return (
                attribute?.value?.toLowerCase() == item?.id?.toLowerCase() &&
                !attribute?.voided
              );
            }) || []
          )?.length > 0 && item[key]?.toLowerCase()?.includes(searchText)
        );
      } else {
        if (
          item?.visit &&
          item?.visit?.patient &&
          item?.visit?.patient.person.display
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          return item;
        }
        return item[key]?.toLowerCase()?.includes(searchText);
      }
    });
  }
}
