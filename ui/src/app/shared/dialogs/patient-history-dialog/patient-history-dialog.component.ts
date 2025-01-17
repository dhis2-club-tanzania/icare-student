import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-patient-history-dialog",
  templateUrl: "./patient-history-dialog.component.html",
  styleUrls: ["./patient-history-dialog.component.scss"],
})
export class PatientHistoryDialogComponent implements OnInit {
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      patient: any;
    }
  ) {}

  ngOnInit() {}
}
