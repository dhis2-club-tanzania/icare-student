import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-cancel',
  templateUrl: './request-cancel.component.html',
  styleUrls: ['./request-cancel.component.scss']
})
export class RequestCancelComponent implements OnInit {

  dataReceived: any;
  reason: string = "";

  constructor(
    private dialogRef: MatDialogRef<RequestCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dataReceived = data;

   }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close();
  }

  onConfirmRejection(){
    this.dialogRef.close(
      { confirmed: true, type: this.dataReceived, reason: this.reason}
    );
  }

}
