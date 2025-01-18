import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";

@Component({
  selector: "app-result-review-modal",
  templateUrl: "./result-review-modal.component.html",
  styleUrls: ["./result-review-modal.component.scss"],
})
export class ResultReviewModalComponent implements OnInit {
  dialogData: any;
  results: any[] = [];
  noResults: any[] = [];
  constructor(
    private dialogRef: MatDialogRef<ResultReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.data?.sample.orders.forEach((order) => {
      let resultObject;
      order?.testAllocations.forEach((testAllocation) => {
        resultObject = {
          testName: testAllocation?.concept?.display,
          results: testAllocation?.results
        }

        this.results = [
          ...this.results,
          resultObject
        ].filter(result => result.results?.length > 0)
        this.noResults = [
          ...this.noResults,
          resultObject
        ].filter(result => result.results?.length === 0)
      })
    })
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
