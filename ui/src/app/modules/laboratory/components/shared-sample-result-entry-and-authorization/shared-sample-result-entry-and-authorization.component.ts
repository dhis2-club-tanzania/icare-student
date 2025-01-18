import { Component, Input, OnInit } from "@angular/core";
import { SampleAllocation } from "src/app/shared/resources/sample-allocations/models/allocation.model";

@Component({
  selector: "app-shared-sample-result-entry-and-authorization",
  templateUrl: "./shared-sample-result-entry-and-authorization.component.html",
  styleUrls: ["./shared-sample-result-entry-and-authorization.component.scss"],
})
export class SharedSampleResultEntryAndAuthorizationComponent
  implements OnInit
{
  @Input() orderWithResults: any;
  instrument: any;
  ordersWithResults: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.ordersWithResults = [this.orderWithResults]?.map(
      (orderWithResult: any) => {
        return {
          ...orderWithResult,
          testAllocations: (
            orderWithResult?.testAllocations?.filter(
              (testAllocation) => testAllocation?.results?.length > 0
            ) || []
          )?.map((testAllocation) => {
            const formattedAllocation = new SampleAllocation(
              testAllocation
            ).toJson();
            // console.log(formattedAllocation);
            if (formattedAllocation?.instrument) {
              this.instrument = formattedAllocation?.instrument;
              // console.log(this.instrument);
            }
            return formattedAllocation;
          }),
        };
      }
    );

    // console.log("orderWithResults", this.ordersWithResults);
  }
}
