import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterFields",
})
export class FilterFieldsPipe implements PipeTransform {
  transform(items: any[], toFilter1: any[], toFilter2: any[]): any[] {
    const toFilter = [...toFilter1, ...toFilter2];
    if (!items) {
      return [];
    }

    if (!toFilter || toFilter?.length === 0) {
      return items;
    }
    return (
      items?.filter(
        (item) =>
          (
            toFilter?.filter(
              (itemToFilter) => item?.key == itemToFilter?.key
            ) || []
          )?.length === 0
      ) || []
    );
  }
}
