import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterFields",
})
export class FilterFieldsPipe implements PipeTransform {
  transform(items: any[], toFilter1?: any[], toFilter2?: any[]): any[] {
    let toFilter = [...(toFilter1 || []), ...(toFilter2 || [])];
    if (!items) {
      return [];
    }

    if (!toFilter || toFilter?.length === 0) {
      return items;
    }
    toFilter = toFilter?.map((item: any) => item?.key);
    return (
      items?.filter(
        (item: any) =>
          (
            toFilter?.filter(
              (itemToFilterKey: any) => itemToFilterKey === item?.key
            ) || []
          )?.length === 0
      ) || []
    );
  }
}
