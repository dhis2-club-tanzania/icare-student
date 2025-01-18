import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterResultsByResultGroup",
})
export class FilterResultsByResultGroupPipe implements PipeTransform {
  transform(results: any[], resultGroup: any): any {
    if (!resultGroup) {
      return results || [];
    }

    return (
      (results || [])?.filter(
        (result) => result?.resultGroup?.uuid === resultGroup?.uuid
      ) || []
    );
  }
}
