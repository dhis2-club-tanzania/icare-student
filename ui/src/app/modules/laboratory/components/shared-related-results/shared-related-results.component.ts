import { Component, Input, OnInit } from "@angular/core";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";

@Component({
  selector: "app-shared-related-results",
  templateUrl: "./shared-related-results.component.html",
  styleUrls: ["./shared-related-results.component.scss"],
})
export class SharedRelatedResultsComponent implements OnInit {
  @Input() allAllocations: SampleAllocationObject[];
  @Input() allocation: SampleAllocationObject;
  allocationMatchingRelatedToParameter: SampleAllocationObject;
  widthsDefn: any;
  constructor() {}

  ngOnInit(): void {
    this.allocationMatchingRelatedToParameter = (this.allAllocations?.filter(
      (allocation: any) =>
        allocation?.parameter?.uuid === this.allocation?.relatedTo?.code
    ) || [])[0];

    // const widths =
    //   this.allocationMatchingRelatedToParameter?.finalResult?.groups[
    //     this.allocationMatchingRelatedToParameter?.finalResult?.groups?.length -
    //       1
    //   ]?.results?.map((result) => {
    //     return parseInt(
    //       (
    //         450 /
    //         this.allocationMatchingRelatedToParameter?.finalResult?.groups[
    //           this.allocationMatchingRelatedToParameter?.finalResult?.groups
    //             ?.length - 1
    //         ]?.results?.length
    //       ).toFixed(0)
    //     );
    //   });
    // const widthsDefn = { widths: widths };
    // this.widthsDefn = widthsDefn.toString();
    // console.log(this.widthsDefn);
  }
}
