import { Component, Input, OnInit } from "@angular/core";
import {
  ResultObject,
  SampleAllocationObject,
} from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { flatten } from "lodash";

@Component({
  selector: "app-shared-related-result-parameter-value",
  templateUrl: "./shared-related-result-parameter-value.component.html",
  styleUrls: ["./shared-related-result-parameter-value.component.scss"],
})
export class SharedRelatedResultParameterValueComponent implements OnInit {
  @Input() parentResult: ResultObject;
  @Input() allocation: SampleAllocationObject;
  result: ResultObject;
  constructor() {}

  ngOnInit(): void {
    const results =
      this.allocation?.finalResult?.groups &&
      this.allocation?.finalResult?.groups?.length > 0
        ? flatten(
            this.allocation?.finalResult?.groups?.map((group) => group?.results)
          )
        : [];
    this.result =
      results?.length > 0
        ? (results?.filter(
            (result) => result?.resultGroupUuid === this.parentResult?.uuid
          ) || [])[0]
        : null;
  }
}
