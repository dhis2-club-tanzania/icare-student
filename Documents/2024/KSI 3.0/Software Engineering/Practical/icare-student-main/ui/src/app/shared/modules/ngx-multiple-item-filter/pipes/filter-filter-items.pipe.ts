import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterFilterItems",
})
export class FilterFilterItemsPipe implements PipeTransform {
  transform(items: any[], selectedItems: any[]): any {
    if (!selectedItems || selectedItems?.length === 0) {
      return items;
    }
    return (
      items?.filter(
        (item) =>
          (
            selectedItems?.filter(
              (selectedItem) => selectedItem?.uuid === item?.uuid
            ) || []
          )?.length === 0
      ) || []
    );
  }
}
