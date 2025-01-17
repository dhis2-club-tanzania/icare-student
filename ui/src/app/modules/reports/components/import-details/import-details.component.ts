import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-import-details",
  templateUrl: "./import-details.component.html",
  styleUrls: ["./import-details.component.scss"],
})
export class ImportDetailsComponent implements OnInit {
  response: any;
  currentReport: any;
  constructor(
    private matDialogRef: MatDialogRef<ImportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.response = data?.response;
    this.currentReport = data?.report;
  }

  ngOnInit(): void {}
}
