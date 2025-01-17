import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "app-delete-confirmation",
  templateUrl: "./delete-confirmation.component.html",
  styleUrls: ["./delete-confirmation.component.scss"],
})
export class DeleteConfirmationComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) {}

  ngOnInit() {}

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();
    this.matDialogRef.close({ confirmed: true });
  }
}
