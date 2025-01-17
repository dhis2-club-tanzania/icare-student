import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-drug-list-modal",
  templateUrl: "./drug-list-modal.component.html",
  styleUrls: ["./drug-list-modal.component.scss"],
})
export class DrugListModalComponent implements OnInit {
  dialogData: any;
  constructor(
    private dialogRef: MatDialogRef<DrugListModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {}

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
