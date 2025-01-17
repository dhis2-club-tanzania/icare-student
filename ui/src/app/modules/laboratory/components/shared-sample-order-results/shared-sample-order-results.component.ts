import { Component, Input, OnInit } from "@angular/core";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { SampleAllocation } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { keyBy } from "lodash";

@Component({
  selector: "app-shared-sample-order-results",
  templateUrl: "./shared-sample-order-results.component.html",
  styleUrls: ["./shared-sample-order-results.component.scss"],
})
export class SharedSampleOrderResultsComponent implements OnInit {
  @Input() ordersWithResults: any;
  @Input() testRelationshipConceptSourceUuid: string;
  allTestAllocations: any[] = [];
  testOrdersDetails$!: Observable<any>;
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.ordersWithResults = this.ordersWithResults?.map((orderWithResult) => {
      const allAllocations = (
        orderWithResult?.testAllocations?.filter(
          (testAllocation) => testAllocation?.results?.length > 0
        ) || []
      )?.map((testAllocation) => {
        return new SampleAllocation({
          ...testAllocation,
          testRelationshipConceptSourceUuid:
            this.testRelationshipConceptSourceUuid,
        }).toJson();
      });
      this.allTestAllocations = [...this.allTestAllocations, ...allAllocations];
      return {
        ...orderWithResult,
        testAllocations: allAllocations,
      };
    });
    //console.log("orderWithResults", this.ordersWithResults);
    this.testOrdersDetails$ = zip(
      ...this.ordersWithResults?.map((orderWithResults: any) => {
        return this.conceptService
          .getConceptDetailsByUuid(
            orderWithResults?.order?.concept?.uuid,
            "custom:(uuid,display,descriptions)"
          )
          .pipe(
            map((conceptResponse: any) => {
              // console.log("Concept service", conceptResponse);
              return conceptResponse;
            })
          );
      })
    ).pipe(
      map((conceptsResponse: any[]) => {
        return keyBy(conceptsResponse, "uuid");
      })
    );
  }
}
