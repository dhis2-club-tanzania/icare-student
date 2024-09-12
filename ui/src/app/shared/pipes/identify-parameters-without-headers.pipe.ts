import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "identifyParametersWithoutHeaders",
})
export class IdentifyParametersWithoutHeadersPipe implements PipeTransform {
  transform(allocations: any[]): any {
    const allocationsWithoutHeadedParameters = allocations?.filter(
      (allocation) =>
        !allocation?.parameter?.parameterHeaders ||
        allocation?.parameter?.parameterHeaders?.length === 0
    );
    return allocationsWithoutHeadedParameters;
  }
}
