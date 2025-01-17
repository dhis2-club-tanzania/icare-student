import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-lab-edit-user-modal",
  templateUrl: "./lab-edit-user-modal.component.html",
  styleUrls: ["./lab-edit-user-modal.component.scss"],
})
export class LabEditUserModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<LabEditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
