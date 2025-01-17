import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchingItem",
})
export class SearchingItemPipe implements PipeTransform {
  transform(items: any[], searchingText: string): any {
    return items && searchingText
      ? items.filter(
          (item) =>
            (item?.searchingText || item?.name)
              ?.toLowerCase()
              .indexOf(searchingText?.toLowerCase()) > -1
        ) || []
      : items && items?.length > 0
      ? items
      : [];
  }
}
