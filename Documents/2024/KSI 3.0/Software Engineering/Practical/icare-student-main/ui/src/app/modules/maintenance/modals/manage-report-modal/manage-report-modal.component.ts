import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-manage-report-modal",
  templateUrl: "./manage-report-modal.component.html",
  styleUrls: ["./manage-report-modal.component.scss"],
})
export class ManageReportModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ManageReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
