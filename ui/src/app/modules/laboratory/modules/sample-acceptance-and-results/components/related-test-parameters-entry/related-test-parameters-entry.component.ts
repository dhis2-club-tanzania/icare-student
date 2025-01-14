import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { orderBy } from "lodash";
@Component({
  selector: "app-related-test-parameters-entry",
  templateUrl: "./related-test-parameters-entry.component.html",
  styleUrls: ["./related-test-parameters-entry.component.scss"],
})
export class RelatedTestParametersEntryComponent implements OnInit {
  @Input() allSampleAllocations: SampleAllocationObject[];
  @Input() parametersWithDefinedRelationship: any[];
  @Input() isLIS: boolean;
  @Input() disabled: boolean;
  @Input() conceptNameType: string;
  @Input() order: any;
  relatedAllocation: any;
  finalResultsForParentTestParameter: any;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  results: any = {};
  allocationsWithoutRelationShip: any[];
  searchingText: string;
  constructor() {}

  ngOnInit(): void {
    this.relatedAllocation =
      this.parametersWithDefinedRelationship[0]?.relatedAllocation;
    this.finalResultsForParentTestParameter =
      this.relatedAllocation?.finalResult &&
      this.relatedAllocation?.finalResult?.groups
        ? orderBy(
            this.relatedAllocation?.finalResult?.groups?.map((group) => {
              return {
                dateCreated: group?.results[0]?.dateCreated,
                ...group,
              };
            }),
            ["dateCreated"],
            ["asc"]
          )[this.relatedAllocation?.finalResult?.groups?.length - 1]?.results
        : this.relatedAllocation?.finalResult &&
          this.relatedAllocation?.finalResult?.value
        ? [this.relatedAllocation?.finalResult]
        : [];
    this.allocationsWithoutRelationShip =
      this.order?.allocations?.filter(
        (allocation) =>
          (
            this.order?.parametersWithDefinedRelationship?.filter(
              (all) => all?.id === allocation?.id
            ) || []
          )?.length === 0
      ) || [];

    // console.log(this.order);
    // console.log(
    //   "this.allocationsWithoutRelationShip",
    //   this.allocationsWithoutRelationShip
    // );
  }

  getFedResult(data: any, relatedResult: any, allocation: any): void {
    this.results[
      data?.parameter?.uuid + (relatedResult ? ":" + relatedResult?.uuid : "")
    ] = {
      ...data,
      previousValue: data?.previousValue?.filter((prevValue: any) => prevValue),
      relatedResult,
      allocation,
    };
    this.data.emit(this.results);
  }
}
