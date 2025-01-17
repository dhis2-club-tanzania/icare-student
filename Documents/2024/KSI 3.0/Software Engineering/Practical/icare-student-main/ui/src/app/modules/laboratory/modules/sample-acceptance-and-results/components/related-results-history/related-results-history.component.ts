import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-related-results-history",
  templateUrl: "./related-results-history.component.html",
  styleUrls: ["./related-results-history.component.scss"],
})
export class RelatedResultsHistoryComponent implements OnInit {
  @Input() parametersWithDefinedRelationship: any[];
  finalResultsForParentTestParameter: any[];
  constructor() {}

  ngOnInit(): void {
    const relatedAllocation =
      this.parametersWithDefinedRelationship[0]?.relatedAllocation;
    this.finalResultsForParentTestParameter =
      relatedAllocation?.finalResult?.groups[
        relatedAllocation?.finalResult?.groups?.length - 1
      ]?.results;
  }
}
