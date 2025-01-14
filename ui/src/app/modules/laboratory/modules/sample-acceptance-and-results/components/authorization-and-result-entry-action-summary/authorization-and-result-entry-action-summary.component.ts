import { Component, Input, OnInit } from "@angular/core";
import { groupBy, orderBy } from "lodash";

@Component({
  selector: "app-authorization-and-result-entry-action-summary",
  templateUrl: "./authorization-and-result-entry-action-summary.component.html",
  styleUrls: ["./authorization-and-result-entry-action-summary.component.scss"],
})
export class AuthorizationAndResultEntryActionSummaryComponent
  implements OnInit
{
  @Input() order: any;
  @Input() sample: any;
  parameter: any;
  parameterResultsDetails: any[];
  resultReference: any;
  constructor() {}

  ngOnInit(): void {
    this.parameter = this.order?.testAllocations[0]?.parameter;
    this.order = {
      ...this.order,
      testAllocations:
        this.order?.testAllocations?.filter(
          (allocation) =>
            allocation?.concept?.uuid === this.parameter?.uuid &&
            allocation?.results?.length > 0
        ) || [],
      allocationsGroupedByParameter: groupBy(
        (
          this.order?.testAllocations?.filter(
            (allocation) =>
              allocation?.concept?.uuid === this.parameter?.uuid &&
              allocation?.results?.length > 0
          ) || []
        )?.map((allocation) => {
          return {
            ...allocation,
            parameterUuid: allocation?.concept?.uuid,
          };
        }),
        "parameterUuid"
      ),
    };
    this.parameterResultsDetails =
      this.order?.allocationsGroupedByParameter[this.parameter?.uuid]
        ?.map((result) => {
          return {
            ...result,
            authorized:
              (
                result?.statuses?.filter(
                  (status) =>
                    status?.status === "APPROVED" ||
                    status?.category === "APPROVED"
                ) || []
              )?.length > 0,
            authorizedBy: {
              ...(result?.statuses?.filter(
                (status) =>
                  status?.status === "APPROVED" ||
                  status?.category === "APPROVED"
              ) || [])[0],
              ...(result?.statuses?.filter(
                (status) =>
                  status?.status === "APPROVED" ||
                  status?.category === "APPROVED"
              ) || [])[0]?.user,
              name: (result?.statuses?.filter(
                (status) =>
                  status?.status === "APPROVED" ||
                  status?.category === "APPROVED"
              ) || [])[0]?.user?.display?.split(" (")[0],
            },
            amended: result?.results?.length > 1 ? true : false,
            results:
              orderBy(result?.results, ["dateCreated"]["desc"])
                ?.map((resultValue, index) => {
                  return {
                    ...resultValue,
                    value: resultValue?.valueBoolean
                      ? resultValue?.valueBoolean
                      : resultValue?.valueText
                      ? resultValue?.valueText
                      : resultValue?.valueNumeric
                      ? resultValue?.valueNumeric
                      : resultValue?.valueDateTime
                      ? resultValue?.valueDateTime
                      : resultValue?.valueCoded
                      ? resultValue?.valueCoded
                      : null,
                    creator: {
                      ...resultValue?.creator,
                      name: resultValue?.creator?.display?.split("(")[0],
                    },
                    resultsFedBy: {
                      ...resultValue?.creator,
                      name: resultValue?.creator?.display?.split("(")[0],
                    },
                    toShow: index === 0,
                  };
                })
                ?.filter((res) => res?.value) || [],
          };
        })
        ?.filter(
          (parameterResultsDetail) =>
            parameterResultsDetail?.results?.length > 0
        ) || [];
    this.resultReference = this.parameterResultsDetails[0]?.results[0];
  }
}
