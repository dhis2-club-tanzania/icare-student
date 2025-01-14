import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { groupBy, orderBy } from "lodash";

@Component({
  selector: "app-shared-parameter-results",
  templateUrl: "./shared-parameter-results.component.html",
  styleUrls: ["./shared-parameter-results.component.scss"],
})
export class SharedParameterResultsComponent implements OnInit {
  @Input() order: any;
  @Input() parameter: any;
  @Input() count: number;
  @Input() units: string;
  @Input() hideParameterLabel: boolean;
  @Input() allocation: any;
  @Input() whatToShow: string;
  @Input() resultGroup: boolean;

  parameterResultsDetails: any;
  resultRemarks: any = {};
  @Output() remarksData: EventEmitter<any> = new EventEmitter<any>();
  groupedResults: any[];
  constructor() {}

  ngOnInit(): void {
    if (this.resultGroup) {
    } else {
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
      this.parameterResultsDetails?.forEach((parameterResultsDetail) => {
        if (parameterResultsDetail?.results?.length > 0) {
          const result = parameterResultsDetail?.results[0];
          this.resultRemarks[this.order?.order?.uuid] =
            (parameterResultsDetail?.statuses?.filter(
              (status) => status?.result?.uuid === result?.uuid
            ) || [])[0];
          this.remarksData.emit(this.resultRemarks);
        }
      });
    }
  }
}
