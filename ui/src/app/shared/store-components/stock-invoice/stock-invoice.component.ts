import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "app-stock-invoice",
  templateUrl: "./stock-invoice.component.html",
  styleUrls: ["./stock-invoice.component.scss"],
})
export class StockInvoiceComponent implements OnInit {
  @Input() currentLocation: string;
  errors: any[];
  loading: boolean;
  constructor() {}

  ngOnInit(): void {}

  reloadForm() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }
}
