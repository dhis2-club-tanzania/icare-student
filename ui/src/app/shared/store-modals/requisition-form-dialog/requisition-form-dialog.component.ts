import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "app-requisition-form-dialog",
  templateUrl: "./requisition-form-dialog.component.html",
  styleUrls: ["./requisition-form-dialog.component.scss"],
})
export class RequisitionFormDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<RequisitionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {}

  onClosePopup(e?: any) {
    this.dialogRef.close();
  }
}
