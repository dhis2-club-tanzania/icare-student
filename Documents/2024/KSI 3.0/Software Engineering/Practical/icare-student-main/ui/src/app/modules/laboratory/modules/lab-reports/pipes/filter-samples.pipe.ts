import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterSamples",
})
export class FilterSamplesPipe implements PipeTransform {
  transform(
    arr: any[],
    searchText: string,
    department?: string,
    fieldName?: string
  ): any[] {
    if (!arr) return [];
    if (!searchText && !department) return arr;
    if (department || searchText) {
      return arr.filter((it: any) => {
        if (department && !searchText) {
          return it?.department?.name
            .toString()
            .toLowerCase()
            .includes(department.toLowerCase());
        } else if (!department && searchText) {
          return it["searchingText"].toLowerCase().includes(searchText);
        }
      });
    } else if (department && searchText) {
      const matchedByDep = arr.filter((it: any) => {
        return it.toString().toLowerCase().includes(department.toLowerCase());
      });
      return matchedByDep.filter((it: any) => {
        return it["searchingText"].toLowerCase().includes(searchText);
      });
    }
  }
}
