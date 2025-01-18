import { Pipe, PipeTransform } from "@angular/core";
import { flatten } from "lodash";

@Pipe({
  name: "getAssociatedFields",
})
export class GetAssociatedFieldsPipe implements PipeTransform {
  transform(items: any[], row: any, colum: any): any[] {
    if (!row || !colum) {
      return [];
    }

    return flatten(
      (items?.filter((item) => item?.row === row && item?.column === colum) ||
        [])[0]?.testAllocationAssociatedFields
    );
  }
}
