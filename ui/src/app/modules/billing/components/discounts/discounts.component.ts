import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Bill } from "../../models/bill.model";
import { flatten } from "lodash";
import { PaymentReceiptComponent } from "../payment-reciept/payment-reciept.component";
import { BillConfirmationComponent } from "../bill-confirmation/bill-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";
import { BillItem } from "../../models/bill-item.model";
import { ThisReceiver } from "@angular/compiler";

@Component({
  selector: "app-discounts",
  templateUrl: "./discounts.component.html",
  styleUrls: ["./discounts.component.scss"],
})
export class DiscountsComponent implements OnInit {
  @Input() discountItems: any[];
  @Input() discountItemsCount;
  @Input() currentPatient: any;
  @Input() logo: any;
  @Input() facilityDetails: any;
  @Input() disableControls: boolean;
  @Input() bill: Bill;
  @Input() bills: Bill[];
  @Input() isBillCleared: boolean;

  @Output() confirmPayment = new EventEmitter<any>();
  @Output() paymentSuccess = new EventEmitter<any>();

  dataSource: MatTableDataSource<any>;
  columns: any[];
  displayedColumns: string[];
  paymentTypes: (
    | { uuid: string; display: string; code: string; direct: boolean }
    | { uuid: string; display: string; code: string; direct?: undefined }
  )[];
  selection = new SelectionModel<any>(true, []);

  selectedPaymentType: any;
  currentUser: any;
  confirmedBillEntities: any;
  payableAmount: any;
  totalPaymentAmount: any;

  get totalPayableBill(): number {
    return (this.selection?.selected || []).reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0
    );
  }

  get canConfirmBill(): boolean {
    return (this.selection?.selected || []).length > 0;
  }

  get totalBillAmount(): number {
    return (this.selection?.selected || []).reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0
    );
  }

  get canDisableItemSelection(): boolean {
    return (this.discountItems || []).some((item) => item.amount === 0);
  }
  get allItemsConfirmed(): boolean {
    return this.selection?.selected.length === this.discountItems.length;
  }
  get isAllSelected() {
    return this.selection?.selected?.length === this.dataSource?.data?.length;
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    let data = this.discountItems.map((discountItem) => {
      return {
        ...discountItem,
        amount: discountItem.price,
        name: discountItem.item.concept.name,
      };
    });

    this.dataSource = new MatTableDataSource(data);

    this.totalPaymentAmount = data.reduce((total, item) => {
      return (total = total + item.amount);
    }, 0);

    this.columns = [
      { id: "index", label: "#", isIndexColumn: true },
      { id: "name", label: "Description", width: "50%" },
      { id: "amount", label: "Amount", isCurrency: true },
    ];

    //Check if bill was cleared

    this.displayedColumns = [];

    this.displayedColumns =
      this.isBillCleared && this.isBillCleared === true
        ? [...this.columns.map((column) => column.id), "select"]
        : [...this.columns.map((column) => column.id)];

    // T

    this.paymentTypes = [
      {
        uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
        display: "Cash",
        code: "CASH",
        direct: true,
      },
      {
        uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
        display: "GePG",
        code: "GePG",
      },
    ];

    this.selectedPaymentType = this.paymentTypes[0];
  }

  onConfirmAll(e): void {
    this.discountItems.forEach((billItem) => {
      this.confirmedBillEntities = {
        ...this.confirmedBillEntities,
        [billItem.id]: e.checked,
      };
    });
  }

  onConfirmBillItem(e, billItem: any): void {
    this.confirmedBillEntities = {
      ...this.confirmedBillEntities,
      [billItem.id]: e.checked,
    };
  }

  onConfirmPayment(e): void {
    e.stopPropagation();
    const dialog = this.dialog.open(BillConfirmationComponent, {
      width: "600px",
      disableClose: true,
      data: {
        billItems: this.selection?.selected.map((item) => {
          delete item["name"];
          delete item["amount"];

          let billItem = {
            ...item,
            discounted: false,
          };
          let bill = item?.invoice?.uuid;
          return new BillItem(billItem, bill);
        }),
        items: this.discountItems.map((item) => {
          let billItem = {
            ...item,
            discounted: false,
          };
          let bill = item?.invoice?.uuid;
          return new BillItem(billItem, bill);
        }),
        bill: this.bill,
        totalPayableBill: this.totalPayableBill,
        paymentType: this.selectedPaymentType,
        currentUser: this.currentUser,
        currentPatient: this.currentPatient,
      },
    });

    dialog.afterClosed().subscribe((paymentResponse) => {
      this.paymentSuccess.emit();
      if (paymentResponse) {
        this.dialog.open(PaymentReceiptComponent, {
          width: "500px",
          data: {
            ...paymentResponse,
            billItems: this.selection?.selected.map((item) => {
              delete item["name"];
              delete item["amount"];

              let billItem = {
                ...item,
                discounted: false,
              };
              let bill = item?.invoice?.uuid;
              return new BillItem(billItem, bill);
            }),
            items: this.discountItems.map((item) => {
              let billItem = {
                ...item,
                discounted: false,
              };
              let bill = item?.invoice?.uuid;
              return new BillItem(billItem, bill);
            }),
            bill: this.bill,
            totalPayableBill: this.totalPayableBill,
            paymentType: this.selectedPaymentType,
            currentUser: this.currentUser,
            currentPatient: this.currentPatient,
            logo: this.logo,
            facilityDetails: this.facilityDetails,
          },
        });
      }
    });
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

  onGetInvoice(e: MouseEvent) {}

  onChangePaymentType(e) {}

  getControlNumber(e: any) {
    e.stopPropagation();
    const dialog = this.dialog.open(BillConfirmationComponent, {
      width: "600px",
      disableClose: true,
      data: {
        billItems: this.selection?.selected,
        items: this.discountItems,
        bill: this.bill,
        totalPayableBill: this.totalPayableBill,
        paymentType: this.selectedPaymentType,
        currentUser: this.currentUser,
        currentPatient: this.currentPatient,
        facilityDetails: this.facilityDetails,
      },
    });
  }
}
