import { Pipe, PipeTransform } from "@angular/core";
import { groupBy, orderBy } from "lodash";

@Pipe({
  name: "groupParametersByHeaders",
})
export class GroupParametersByHeadersPipe implements PipeTransform {
  transform(parametersAllocations: any[]): any {
    const allocationsForParametersWithHeaders = parametersAllocations
      ?.filter(
        (allocation) => allocation?.parameter?.parameterHeaders?.length > 0
      )
      .map((allocationWithHeadedParameter) => {
        return {
          ...allocationWithHeadedParameter,
          headerUuid:
            allocationWithHeadedParameter?.parameter?.parameterHeaders[0]?.uuid,
          parameterHeader:
            allocationWithHeadedParameter?.parameter?.parameterHeaders[0],
        };
      });
    const groupedAllocations = groupBy(
      allocationsForParametersWithHeaders,
      "headerUuid"
    );
    return orderBy(
      Object.keys(groupedAllocations).map((key) => {
        return {
          headerUuid: key,
          display: groupedAllocations[
            key
          ][0]?.parameterHeader?.display?.replace("PARAMETER_HEADER:", ""),
          allocations: groupedAllocations[key],
          sortOrder: groupedAllocations[key][0]?.parameterHeader?.sortOrder,
        };
      }),
      ["sortOrder", "display"],
      ["asc", "asc"]
    );
  }
}
