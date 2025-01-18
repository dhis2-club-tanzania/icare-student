import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getAllReportsOfCurrentReportSentToDHIS2 } from "src/app/store/selectors";

@Component({
  selector: "app-dhis2-reports-sent-summary",
  templateUrl: "./dhis2-reports-sent-summary.component.html",
  styleUrls: ["./dhis2-reports-sent-summary.component.scss"],
})
export class Dhis2ReportsSentSummaryComponent implements OnInit {
  reportsSentToDHIS2$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.reportsSentToDHIS2$ = this.store.select(
      getAllReportsOfCurrentReportSentToDHIS2
    );
  }
}
