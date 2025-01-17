import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "app-stock-invoice-form-dialog",
  templateUrl: "./stock-invoice-form-dialog.component.html",
  styleUrls: ["./stock-invoice-form-dialog.component.scss"],
})
export class StockInvoiceFormDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<StockInvoiceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {}

  onClosePopup(e?: any){
    this.dialogRef.close();
  }
}
