import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { BillableItemsService } from "src/app/shared/resources/billable-items/services/billable-items.service";
import { BillItem } from "../../models/bill-item.model";
import { Bill } from "../../models/bill.model";
import { PaymentInput } from "../../models/payment-input.model";
import { BillConfirmationComponent } from "../bill-confirmation/bill-confirmation.component";
import { PaymentReceiptComponent } from "../payment-reciept/payment-reciept.component";

@Component({
  selector: "app-quotation-item",
  templateUrl: "./quotation-item.component.html",
  styleUrls: ["./quotation-item.component.scss"],
})
export class QuotationItemComponent implements OnInit {
  @Input() bill: Bill;
  @Input() billItems: BillItem[];
  @Input() disableControls: boolean;
  @Input() paymentTypes: any[];
  @Input() currentUser: any;
  @Input() expanded: boolean;
  @Input() currentPatient: any;
  @Input() facilityDetails: any;
  @Input() logo: any;

  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  confirmedBillEntities: any = {};
  columns: any[];
  displayedColumns: string[];
  selectedPaymentType: any;

  @Output() confirmPayment = new EventEmitter<PaymentInput>();
  @Output() paymentSuccess = new EventEmitter<any>();
  gepgConceptUuid$: Observable<any>;

  constructor(
    private dialog: MatDialog,
    private billableItemsService: BillableItemsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  get canDisableItemSelection(): boolean {
    return (this.billItems || []).some((item) => item.payable === 0);
  }

  get canConfirmBill(): boolean {
    return (this.selection?.selected || []).length > 0;
  }

  get allItemsConfirmed(): boolean {
    return this.selection?.selected.length === this.billItems.length;
  }

  get totalBillAmount(): number {
    return (this.selection?.selected || []).reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0
    );
  }

  get totalBillDiscount(): number {
    return (this.selection?.selected || []).reduce(
      (sum, item) => sum + parseInt(item.discount, 10),
      0
    );
  }

  get totalPayableBill(): number {
    return (this.selection?.selected || []).reduce(
      (sum, item) => sum + parseInt(item.payable, 10),
      0
    );
  }

  get isAllSelected() {
    return this.selection?.selected?.length === this.dataSource?.data?.length;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.billItems);

    this.columns = [
      { id: "index", label: "#", isIndexColumn: true },
      { id: "name", label: "Description", width: "50%" },
      { id: "quantity", label: "Quantity" },
      { id: "price", label: "Unit Price", isCurrency: true },
      { id: "discount", label: "Discount", isCurrency: true },
      {
        id: "calculatedPayableAmount",
        label: "Payable Amount",
        isCurrency: true,
      },
    ];
    this.displayedColumns = [
      ...this.columns.map((column) => column.id),
      "select",
    ];
    // TODO: Remove hardcoding for payment type
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

    this.gepgConceptUuid$ = this.systemSettingsService.getSystemSettingsByKey(
      "icare.billing.payment.paymentMethod.gepg.field.1"
    );

    this.selectedPaymentType = this.paymentTypes[0];
  }

  onConfirmAll(e): void {
    this.billItems.forEach((billItem) => {
      this.confirmedBillEntities = {
        ...this.confirmedBillEntities,
        [billItem.id]: e.checked,
      };
    });
  }

  onConfirmBillItem(e, billItem: BillItem): void {
    this.confirmedBillEntities = {
      ...this.confirmedBillEntities,
      [billItem.id]: e.checked,
    };
  }

  onConfirmPayment(e): void {
    // const paymentType: any = this.selectedPaymentType;
    e.stopPropagation();
    const dialog = this.dialog.open(BillConfirmationComponent, {
      width: "600px",
      disableClose: true,
      data: {
        billItems: this.selection?.selected,
        items: this.billItems,
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
            billItems: this.selection?.selected,
            items: this.billItems,
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

  onChangePaymentType(e) {
    console.log(e);
  }

  getControlNumber(e: any, gepgConceptUuid?: any) {
    e.stopPropagation();
    const dialog = this.dialog.open(BillConfirmationComponent, {
      width: "600px",
      disableClose: true,
      data: {
        billItems: this.selection?.selected,
        items: this.billItems,
        bill: this.bill,
        totalPayableBill: this.totalPayableBill,
        paymentType: this.selectedPaymentType,
        currentUser: this.currentUser,
        currentPatient: this.currentPatient,
        facilityDetails: this.facilityDetails,
        gepgConceptUuid: gepgConceptUuid,
      },
    });

    dialog.afterClosed().subscribe((paymentResponse) => {
      this.paymentSuccess.emit();
      if (paymentResponse) {
        this.dialog.open(PaymentReceiptComponent, {
          width: "500px",
          data: {
            ...paymentResponse,
            billItems: this.selection?.selected,
            items: this.billItems,
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
}
