import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchItem",
})
export class SearchItemPipe implements PipeTransform {
  transform(arr: any[], searchText: string, fieldName?: string): any[] {
    if (!arr) return [];
    if (!searchText) return arr;
    searchText = searchText.toLowerCase();
    return arr.filter((item: any) => {
      if (item?.searchText) {
        return item?.searchText.toLowerCase().includes(searchText);
      } else {
        return searchText["name"].toLowerCase().includes(searchText);
      }
    });
  }
}
