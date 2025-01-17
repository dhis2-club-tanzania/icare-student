import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchTestDetails",
})
export class SearchTestDetailsPipe implements PipeTransform {
  transform(data: any[], searchingText: string): any[] {
    return !searchingText
      ? data || []
      : (data || [])?.filter(
          (dataItem) =>
            dataItem?.searchingText
              ?.toLowerCase()
              ?.indexOf(searchingText?.toLocaleLowerCase()) > -1
        ) || [];
  }
}
