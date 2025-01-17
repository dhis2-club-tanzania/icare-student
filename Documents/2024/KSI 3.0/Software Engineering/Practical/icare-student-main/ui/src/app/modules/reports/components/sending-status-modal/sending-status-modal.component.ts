import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import {
  getErrorSendingDataToDHIS2,
  getResponseAfterSendingData,
  getSendingDataToDHIS2HasError,
  getSendToDHIS2LOadingState,
  getSendToDHIS2SuccessState,
} from "src/app/store/selectors/dhis2-reports.selectors";
import { ImportDetailsComponent } from "../import-details/import-details.component";

@Component({
  selector: "app-sending-status-modal",
  templateUrl: "./sending-status-modal.component.html",
  styleUrls: ["./sending-status-modal.component.scss"],
})
export class SendingStatusModalComponent implements OnInit {
  sendingToDHIS2State$: Observable<boolean>;
  sendingDataToDHIS2HasErrorState$: Observable<boolean>;
  sendingDataToDHIS2Error$: Observable<any>;
  sentDataSuccessState$: Observable<boolean>;
  sendingDataResponse$: Observable<any>;
  currentReport: any;
  constructor(
    private matDialogRef: MatDialogRef<SendingStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.currentReport = data?.report;
  }

  ngOnInit(): void {
    this.sendingDataToDHIS2HasErrorState$ = this.store.select(
      getSendingDataToDHIS2HasError
    );
    this.sendingToDHIS2State$ = this.store.select(getSendToDHIS2LOadingState);
    this.sendingDataToDHIS2Error$ = this.store.select(
      getErrorSendingDataToDHIS2
    );
    this.sentDataSuccessState$ = this.store.select(getSendToDHIS2SuccessState);
    this.sendingDataResponse$ = this.store.select(getResponseAfterSendingData);
  }

  onCancel(e) {
    e.stopPropagation();
    this.matDialogRef.close(false);
  }

  viewMoreDetails(e, response) {
    e.stopPropagation();
    // console.log("response", response);
    this.dialog.open(ImportDetailsComponent, {
      data: {
        response,
        report: this.currentReport,
      },
      minHeight: "310px",
      maxHeight: "310px",
      width: "680px",
      panelClass: "custom-dialog-container",
      disableClose: false,
    });
  }
}
