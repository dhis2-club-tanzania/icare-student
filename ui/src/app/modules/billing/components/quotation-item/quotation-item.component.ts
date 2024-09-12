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
import { sum, sumBy } from "lodash";
import { formatDateToString } from "src/app/shared/helpers/format-date.helper";
import { forEach } from "cypress/types/lodash";

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
    // console.log(e);
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
  onPrint(e: any): void {
    let contents: string;

    const frame1: any = document.createElement("iframe");
    frame1.name = "frame3";
    frame1.style.position = "absolute";
    frame1.style.width = "100%";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);

    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;

    frameDoc.document.open();

    frameDoc.document.write(`
      <html>
        <head> 
          <style> 
              @page { size: auto;  margin: 0mm; }
              
              body {
                padding: 30px;
                margin: 0 auto;
                width: 100mm;
              }

              #top .logo img{
                //float: left;
                height: 100px;
                width: 100px;
                background-size: 100px 100px;
              }
              .info h2 {
                font-size: 1.3em;
              }
              h3 {
                font-size: 1em;
              }
              h5 {
                font-size: .7em;
              }
              p {
                font-size: .7em;
              }
              #table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
                background-color: #000;
              } 
              #table td, #table  th {
                border: 1px solid #ddd;
                padding: 5px;
              } 
              
              #table tbody tr:nth-child(even){
                background-color: #f2f2f2;
              } 

              #table thead tr th { 
                padding-top:6px; 
                padding-bottom: 6px; 
                text-align: left; 
                background-color: #cecece;
                font-size: .7em;
              }
              tbody tr td {
                font-size: .7em;
              }
              .footer {
                margin-top:50px
              }
              .footer .userDetails .signature {
                margin-top: 20px;
              }
          </style>
        </head>
        <body> 
         <div id="printOut">
        `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";

    let header = "";
    let subHeader = "";

    e.FacilityDetails?.attributes?.map((attribute) => {
      let attributeTypeName =
        attribute && attribute.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
      header = attributeTypeName === "header" ? attribute?.value : "";
      subHeader = attributeTypeName === "sub header" ? attribute?.value : "";
    });

    let patientMRN =
      e.CurrentPatient?.MRN ||
      e.CurrentPatient?.patient?.identifiers[0]?.identifier.replace(
        "MRN = ",
        ""
      );

    frameDoc.document.write(`
    
      <center id="top">
         <div class="info">
          <h2>${header.length > 0 ? header : e.FacilityDetails.display} </h2>
          </div>
        <div class="logo">
          <img src="${image}" alt="Facility's Logo"> 
        </div>
        

        <div class="info">
          <h2>${
            subHeader.length > 0 ? subHeader : e.FacilityDetails.description
          } </h2>    <h3>P.O Box ${e.FacilityDetails.postalCode} ${
      e.FacilityDetails.stateProvince
    }</h3>
          <h3>${e.FacilityDetails.country}</h3>
        </div>
        <!--End Info-->
      </center>
      <!--End Document top-->
      
      
      <div id="mid">
        <div class="patient-info">
          <p> 
              Patient Name : ${e.CurrentPatient.name}</br>
          </p>
          <p> 
              MRN : ${patientMRN}</br>
          </p>
        </div>
      </div>`);

    //For paid items
    if (e.Payments) {
      if (e.Payments.length > 0) {
        frameDoc.document.write(`
        <div>
          <h5>Paid Items</h5>
        </div>
        <table id="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Date paid</th>
            </tr>
          </thead>
          <tbody>`);

        e.Payments.forEach((payment) => {
          payment.items.forEach((item) => {
            let paymentDate = new Date(payment.created);
            // Date to string
            let date_paid = formatDateToString(paymentDate);
            // let date_paid = `${
            //   paymentDate.getDate().toString().length > 1
            //     ? paymentDate.getDate()
            //     : "0" + paymentDate.getDate()
            // }-${
            //   paymentDate.getMonth().toString().length > 1
            //     ? paymentDate.getMonth() + 1
            //     : "0" + paymentDate.getMonth() + 1
            // }-${paymentDate.getFullYear()}`;
            contents = `
                <tr>
                  <td>${item.name}</td> 
                  <td>${item.amount}</td>  
                  <td>${date_paid}</td>
                </tr>`;
            frameDoc.document.write(contents);
          });
        });

        let total = sum(
          e.Payments.map((payment) => {
            return sumBy(payment.paymentDetails.items, "amount");
          })
        );
        contents = `<tr>
        
        <td  style ="font-weight:bold;"> &nbsp;Total </td>
        <td colspan="2" style ="font-weight:bold; text-align:center">${total}</td>
        </tr>`;
        frameDoc.document.write(contents);
        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    //For bills
    if (e.Bill) {
      // console.log("The bills are:", e.Bill);
      if (e.Bill.length > 0) {
        // let sum = sumBy(
        //   e.Bill.filter((record) => record.billItem.discounted === false),
        //   "amount"
        // );
        let sum = sumBy(e.Bill, "payable");

        frameDoc.document.write(`
        <div>
          <h5>Unpaid Items (Un-attended items)</h5>
        </div>
        <table id="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
        <tbody>`);

        // e.Bill.forEach((bill) => {
        e.Bill.forEach((record) => {
          if (!record.discounted || record.payable > 0) {
            contents = `
            <tr>
              <td>${record.name}</td> 
              <td>${record.quantity}</td> 
              <td>${record.payable}</td>
            </tr>`;
            frameDoc.document.write(contents);
          }
        });
        contents = `<tr>

          <td  style ="font-weight:bold;"> &nbsp;Total </td>
          <td colspan="2" style ="font-weight:bold; text-align:center">${sum}</td>
          </tr>`;
        frameDoc.document.write(contents);

        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    //For exempted items
    if (e.Bill) {
      if (e.Bill.length > 0) {
        // let exempted_sum = sumBy(
        //   e.Bill.filter((record) => record.billItem.discounted === true),
        //   "amount"
        // );
        let exempted_sum = sumBy(e.Bill, "discount");

        frameDoc.document.write(`
        <div>
          <h5>Exempted Items</h5>
        </div>
        <table id="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
        <tbody>`);

        // e.Bill.forEach((bill) => {
        e.Bill.forEach((record) => {
          if (record.discounted) {
            contents = `
            <tr>
              <td>${record.name}</td> 
              <td>${record.quantity}</td> 
              <td>${record.discount}</td>
            </tr>`;
            frameDoc.document.write(contents);
          }
        });
        contents = `<tr>

          <td  style ="font-weight:bold;"> &nbsp;Total </td>
          <td colspan="2" style ="font-weight:bold; text-align:center">${exempted_sum}</td>
          </tr>`;
        frameDoc.document.write(contents);

        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    frameDoc.document.write(`
          <div class="footer">
            <div class="userDetails">
              <p class="name">Printed By: ${e.CurrentUser?.person?.display}</p>
              <p class="signature">Signature : ..............................</p>
            </div>

            <div class=""printDate>
              <p>Printed on: ${e.PrintingDate}</p>
            </div>
          </div>
        </div>
      </body>
    </html>`);

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }
}
