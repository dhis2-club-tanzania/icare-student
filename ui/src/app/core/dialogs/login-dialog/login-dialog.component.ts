import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"],
})
export class LoginDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {}

  ngOnInit() {}

  onClose() {
    this.dialogRef.close();
  }
}
