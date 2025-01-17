import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BillItemObject } from "../../models/bill-item-object.model";
import { BillItem } from "../../models/bill-item.model";
import { BillObject } from "../../models/bill-object.model";
import { BillConfirmationComponent } from "../bill-confirmation/bill-confirmation.component";
import { keys } from "lodash";
import { PaymentInput } from "../../models/payment-input.model";
import { PaymentTypeInterface } from "src/app/shared/models/payment-type.model";
import { MatTableDataSource } from "@angular/material/table";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-quotations",
  templateUrl: "./quotations.component.html",
  styleUrls: ["./quotations.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class QuotationsComponent implements OnInit {
  @Input() patientBillingDetails: any;
  @Input() bills: BillObject[];
  @Input() confirmingPayment: boolean;
  @Input() disableControls: boolean;
  @Input() currentUser: any;
  @Input() currentPatient: any;
  @Input() logo: any;
  @Input() facilityDetails: any;
  @Input() exemptionOrderType: any;
  displayedColumns: any[];
  columns: any[];
  dataSource: MatTableDataSource<any>;
  expandedElement: any;
  selection = new SelectionModel<any>(true, []);

  @Output() updateBillItems = new EventEmitter<BillItemObject[]>();
  @Output() confirmPayment = new EventEmitter<{
    bill: BillObject;
    paymentInput: PaymentInput;
  }>();
  @Output() billPaymentSuccess = new EventEmitter<any>();
  @Output() checkOpenExemptionRequest = new EventEmitter<any>();
  constructor() {}

  get isAllSelected() {
    return this.selection?.selected?.length === this.dataSource?.data?.length;
  }

  ngOnInit(): void {
    // console.log("************************")
    // console.log(this.patientBillingDetails);
    this.bills.reverse();
    // console.log(this.bills);
    if (this.exemptionOrderType) {
      this.checkOpenExemptionRequest.emit(this.exemptionOrderType?.value);
    }

    this.columns = [{ id: "orderNumber", label: "Order Number" }];
    this.displayedColumns = ["orderNumber", "select"];
    this.dataSource = new MatTableDataSource([
      {
        orderNumber: "#3424",
      },
      {
        orderNumber: "#3444",
      },
    ]);
  }

  onConfirmBillItems(billItems: BillItemObject[]): void {
    this.updateBillItems.emit(billItems);
  }

  onConfirmBillPayment(paymentInput: PaymentInput, bill: BillObject): void {
    this.confirmPayment.emit({ bill, paymentInput });
  }

  onSelectRow(e: MouseEvent, row) {
    e.stopPropagation();

    if (this.expandedElement === row.orderNumber) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row.orderNumber;
    }
  }

  onToggleAll(e) {
    if (this.isAllSelected) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.dataSource?.data || []));
  }

  onToggleOne(row) {
    this.selection.toggle(row);
  }

  onPaymentSuccess() {
    this.billPaymentSuccess.emit();
  }
}
