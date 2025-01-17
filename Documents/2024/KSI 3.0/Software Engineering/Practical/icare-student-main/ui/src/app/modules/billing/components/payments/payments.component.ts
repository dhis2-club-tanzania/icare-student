import { Component, Input, OnInit } from "@angular/core";
import { PaymentItem } from "../../models/payment-item.model";
import { PaymentObject } from "../../models/payment-object.model";
import { Payment } from "../../models/payment.model";
import { flatten, each } from "lodash";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent implements OnInit {
  @Input() payments: Payment[];
  paymentItems: PaymentItem[];
  @Input() currentPatient: any;
  @Input() facilityDetails: any;
  @Input() logo: any;
  dataSource: MatTableDataSource<any>;
  totalBill: number = 0;

  facilityDetailsJson: any;
  facilityLogoBase64: string;

  columns: any[];
  displayedColumns: string[];
  constructor() {}

  ngOnInit(): void {
    this.facilityDetailsJson =
      this.facilityDetails?.results?.length > 0
        ? JSON.parse(this.facilityDetails?.results[0]?.value)
        : null;

    this.facilityLogoBase64 =
      this.logo?.results?.length > 0 ? this.logo?.results[0]?.value : null;
    this.paymentItems = flatten(
      (this.payments || []).map((payment) => payment.items)
    );

    each(this.payments, (payment) => {
      this.totalBill = this.totalBill + payment?.amount;
    });

    // console.log("payments : ",this.payments)
    // console.log(this.currentPatient);

    this.dataSource = new MatTableDataSource(this.paymentItems);

    this.columns = [
      { id: "index", label: "#", isIndexColumn: true },
      { id: "referenceNumber", label: "Ref#" },
      { id: "name", label: "Description" },
      { id: "amount", label: "Amount", isCurrency: true },
      { id: "paymentType", label: "Payment method" },
      { id: "confirmedBy", label: "Confirmed by" },
      { id: "created", label: "Date", isDate: true },
    ];
    this.displayedColumns = this.columns.map((column) => column.id);
  }

  printDiv() {
    var divContents = document.getElementById("print-section").innerHTML;
    var a = window.open("", "");
    a.document.write("<html>");
    a.document.write("<body >");
    a.document.write(divContents);
    a.document.write("</body></html>");
    a.document.close();
    // a.document.body.style.height = '55mm';
    a.print();
  }
}
