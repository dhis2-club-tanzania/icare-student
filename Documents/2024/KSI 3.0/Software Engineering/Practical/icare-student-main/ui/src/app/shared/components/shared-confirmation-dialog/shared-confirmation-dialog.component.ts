import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-shared-confirmation-dialog",
  templateUrl: "./shared-confirmation-dialog.component.html",
  styleUrls: ["./shared-confirmation-dialog.component.scss"],
})
export class SharedConfirmationDialogComponent implements OnInit {
  dialogData: any;
  constructor(
    private dialogRef: MatDialogRef<SharedConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {}

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(true);
  }
}
