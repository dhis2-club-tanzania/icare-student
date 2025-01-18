import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getCurrentReportsSubmittedHistory } from "src/app/store/selectors/dhis2-reports.selectors";

@Component({
  selector: "app-report-sent-history-modal",
  templateUrl: "./report-sent-history-modal.component.html",
  styleUrls: ["./report-sent-history-modal.component.scss"],
})
export class ReportSentHistoryModalComponent implements OnInit {
  reportsLogsHistory$: Observable<any[]>;
  constructor(
    private dialogRef: MatDialogRef<ReportSentHistoryModalComponent>,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.reportsLogsHistory$ = this.store.select(
      getCurrentReportsSubmittedHistory
    );
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
