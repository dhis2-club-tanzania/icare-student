import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterAllocationsByName",
})
export class FilterAllocationsByNamePipe implements PipeTransform {
  transform(allocations: any[], searchingText: string): any[] {
    if (!searchingText) {
      return allocations;
    }

    return (
      allocations?.filter(
        (allocation) =>
          allocation?.parameter?.display
            ?.toLowerCase()
            ?.indexOf(searchingText?.toLowerCase()) > -1
      ) || []
    );
  }
}
