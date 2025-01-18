import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-data-history-modal",
  templateUrl: "./data-history-modal.component.html",
  styleUrls: ["./data-history-modal.component.scss"],
})
export class DataHistoryModalComponent implements OnInit {
  dataChangesDetails: any;
  elementHeader: any;
  constructor(
    private dialogRef: MatDialogRef<DataHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dataChangesDetails = data?.dataChangesDetails;
    this.elementHeader = data?.elementHeader;
  }

  ngOnInit(): void {}

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
