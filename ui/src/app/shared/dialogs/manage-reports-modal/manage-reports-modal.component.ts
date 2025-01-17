import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-manage-reports-modal",
  templateUrl: "./manage-reports-modal.component.html",
  styleUrls: ["./manage-reports-modal.component.scss"],
})
export class ManageReportsModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ManageReportsModalComponent>) {}

  ngOnInit(): void {}

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
