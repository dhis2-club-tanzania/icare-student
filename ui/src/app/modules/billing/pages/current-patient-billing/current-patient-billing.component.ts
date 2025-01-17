import { Payment } from "src/app/modules/billing/models/payment.model";
import { keys, sumBy, sum, groupBy } from "lodash";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable, of, zip } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { ConfigsService } from "src/app/shared/services/configs.service";
import { BillObject } from "../../models/bill-object.model";
import { BillPayment } from "../../models/bill-payment.model";
import { Bill } from "../../models/bill.model";
import { PaymentInput } from "../../models/payment-input.model";
import { BillingService } from "../../services/billing.service";
import { PaymentService } from "../../services/payment.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation, getParentLocation } from "src/app/store/selectors";
import { DomSanitizer } from "@angular/platform-browser";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { EncountersService } from "src/app/shared/services/encounters.service";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { any } from "cypress/types/bluebird";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { getEncounterTypeByName } from "src/app/store/selectors/encounter-type.selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { MatTableDataSource } from "@angular/material/table";
import { getIsPatientSentForExemption } from "src/app/store/selectors/visit.selectors";
import { go, loadCurrentPatient } from "src/app/store/actions";
import { MatDialog } from "@angular/material/dialog";
import { ExemptionConfirmationComponent } from "../../components/exemption-confirmation/exemption-confirmation.component";
import { formatDateToString } from "src/app/shared/helpers/format-date.helper";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
import { animate, state, style, transition, trigger } from "@angular/animations";


interface Payments {
  position: number;
  receivedBy: string;
  creator: string;
  paymentType: string;
  referenceNumber: string;
  status: string;
  createdAt: string;
  receiptNumber: string;
  billAmount: number;
  paidAmount: number;
  gepgpaymentDate: string;
  payerNumber: string;
  payerName: string;
  pspName: string;
  accountNumber: string;
}



@Component({
  selector: "app-current-patient-billing",
  templateUrl: "./current-patient-billing.component.html",
  styleUrls: ["./current-patient-billing.component.scss"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CurrentPatientBillingComponent implements OnInit {
  loading: boolean;
  loadingError: string;
  patientVisit$: Observable<Visit>;
  currentLocation$: Observable<any>;
  patientId: string;
  facilityDetails$: Observable<any>;
  facilityLogo$: Observable<any>;
  facility: any;
  patientBillingDetails$: Observable<{
    visit: Visit;
    bills: Bill[];
    payments: Payment[];
    paymentItemCount: number;
    pendingPayments: BillPayment[];
  }>;
  currentPatient$: Observable<Patient>;
  parentLocation$: Observable<any>;
  currentUser$: Observable<any>;
  provider$: Observable<any>;
  creatingOrdersResponse$: Observable<any>;
  discountItems: any[] = [];
  discountItemsCount: any = 0;
  bill: Bill;
  exemptionEncounterType$: Observable<any>;
  exemptionOrderType$: Observable<any>;
  exemptionConcept$: Observable<any>;
  hasOpenExemptionRequest: boolean;
  isBillCleared: boolean;
  errors: any[] = [];
  displayedColumns: string[] = ['position','createdAt', 'receivedBy', 'creator', 'paymentType', 'referenceNumber', 'status','print'];
  dataSource: Payments[] = [];
  color: string = '';
  expandedElement: Payments | null;
  onRowClick(row: any): void {
    // Only expand if paymentType is 'Gepg'
    if (row.paymentType === 'Gepg') {
      this.expandedElement = this.expandedElement === row ? null : row;
    }
  }


  constructor(
    private route: ActivatedRoute,
    private visitService: VisitsService,
    private billingService: BillingService,
    private paymentService: PaymentService,
    private patientService: PatientService,
    private configService: ConfigsService,
    private encounterService: EncountersService,
    private ordersService: OrdersService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.patientId = this.route?.snapshot?.params?.patientId;
    this._getPatientDetails();
    this.currentPatient$ = this.patientService.getPatient(this.patientId);
    this.store.dispatch(
      loadCurrentPatient({ uuid: this.patientId, isRegistrationPage: false })
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.facilityLogo$ = this.configService.getLogo();
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.provider$ = this.store.select(getProviderDetails);

    this.billingService
      .getAllPatientInvoices(this.patientId, false, "all")
      .subscribe({
        next: (bills) => {
          // console.log("The bills are", bills);
          bills.forEach((bill) => {
            if (bill) {
              this.bill = bill;
              //Get discounted Items

              bill.billDetails.discountItems.forEach((discountItem) => {
                let paidAmount: number = 0;
                let paidItems: any[] = [];
                let givenItems: any[] = [];
                let item: any;

                //Get total amount that is already paid for an item
                bill.billDetails.payments.forEach((payment) => {
                  payment.items.forEach((paymentItem) => {
                    if (discountItem.item.uuid === paymentItem.item.uuid) {
                      paidItems = [...paidItems, paymentItem];
                    }
                  });
                });

                //Get total amount of the item from the list of items the patient has
                bill.billDetails.items.forEach((givenItem) => {
                  if (discountItem.item.uuid === givenItem.item.uuid) {
                    givenItems = [...givenItems, givenItem];
                    item = givenItem;
                  }
                });

                //calculate total amount paid
                paidItems.forEach((paymentItem) => {
                  paidAmount = paidAmount + parseInt(paymentItem.amount, 10);
                });

                //Check if bill was cleared
                let payableAmount = givenItems[0].price - discountItem.amount;
                if (paidAmount >= payableAmount) {
                  this.isBillCleared = true;
                }

                // return givenItem with discounted amount if paid amount is less than item's price
                if (paidAmount < givenItems[0].price) {
                  givenItems[0] = {
                    ...givenItems[0],
                    price: discountItem.amount,
                  };

                  //Filterout for items that were exempted twice
                  this.discountItems = this.discountItems.filter(
                    (discountItem) => {
                      if (
                        !(discountItem.item.uuid === givenItems[0].item.uuid)
                      ) {
                        return discountItem;
                      }
                    }
                  );

                  this.discountItems = [...this.discountItems, givenItems[0]];
                }
              });

              this.discountItemsCount =
                this.discountItems.length > 0 ? this.discountItems.length : 0;
            }
          });
        },
      });

    // Get exemption encounter Type
    this.exemptionEncounterType$ = this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.encounterType")
      .pipe(
        tap((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Missing Icare Exemption Configurations. Please set 'icare.billing.exemption.encounterType' or Contact IT",
                },
              },
            ];
          }
        })
      );

    //Get exemption order type
    this.exemptionOrderType$ = this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.orderType")
      .pipe(
        tap((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Missing Icare Exemption Configurations. Please set 'icare.billing.exemption.orderType' or Contact IT",
                },
              },
            ];
          }
        })
      );

    //Get exemption Concept
    this.exemptionConcept$ = this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.concept")
      .pipe(
        tap((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Missing Icare Exemption Configurations. Please set 'icare.billing.exemption.concept' or Contact IT",
                },
              },
            ];
          }
        })
      );
      this.patientBillingDetails$
      .pipe(
        map((data: any) => data.payments.map((payment: any, index: number) => ({
          position: index + 1,
          receivedBy: payment.paymentDetails.receivedBy,
          creator: payment.paymentDetails.creator.display,
          paymentType: payment.paymentDetails.paymentType.name,
          referenceNumber: payment.paymentDetails.referenceNumber,
          status: payment.status,
          createdAt: new Date(payment.created).toLocaleDateString(),
          receiptNumber: payment.paymentDetails.receiptNumber,
          billAmount: payment.paymentDetails.billAmount,
          paidAmount: payment.paymentDetails.paidAmount,
          gepgpaymentDate: new Date(payment.paymentDetails.paymentDate).toLocaleDateString(),
          payerNumber: payment.paymentDetails.payerNumber,
          payerName: payment.paymentDetails.payerName,
          pspName: payment.paymentDetails.pspName,
          accountNumber: payment.paymentDetails.accountNumber,

        })))
      )
      .subscribe((payments: Payments[]) => {
        this.dataSource = payments;
      });
    
  }


  printElement(element: any) {
    console.log('Printing:', element);
  }

  
  private _getPatientDetails() {
    this.loading = true;

    this.patientBillingDetails$ = zip(
      this.visitService.getActiveVisit(this.patientId, false),
      this.billingService.getPatientBills(this.patientId),
      this.paymentService.getPatientPayments(this.patientId)
    ).pipe(
      map((res) => {
        this.loading = false;
        const visit = res[0];
        const bills = res[1];
        const payments = res[2];
        return {
          visit,
          bills: bills.filter((bill) => {
            if (!bill.isInsurance && bill.items.length > 0) {
              return bill;
            }
          }),
          payments: payments,
          paymentKeys: Object.keys(groupBy(payments, "visit")),
          currentPayments: groupBy(payments, "visit")[visit?.uuid],
          paymentItemCount: payments
            .map((payment) => payment?.items?.length || 0)
            .reduce((sum, count) => sum + count, 0),
          pendingPayments: bills.filter((bill) => bill.isInsurance),
        };
      }),
      catchError((error) => {
        this.loadingError = error;
        this.loading = false;
        return of(null);
      })
    );
  }

  onConfirmBillPayment(results: {
    bill: BillObject;
    paymentInput: PaymentInput;
  }): void {}

  onPaymentSuccess() {
    this._getPatientDetails();
  }
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
    this.googleAnalyticsService.sendAnalytics(`Cashier`,`${eventname}: Print`,`Billing`)
  }
  onCheckOpenExemptionRequest(orderTypeUuid: any): any {
    this.store
      .select(getIsPatientSentForExemption(orderTypeUuid))
      .subscribe((value) => (this.hasOpenExemptionRequest = value));
  }

  requestExemption(patientBillingDetails, params) {
    let currentDate = new Date();

    let exemptionEncounterStart = {
      visit: patientBillingDetails.visit?.uuid,
      patient: params.currentPatient?.id,
      encounterType: params?.exemptionEncounterType,
      location: params.currentLocation?.uuid,
      encounterProviders: [
        {
          provider: params.provider?.uuid,
          encounterRole: ICARE_CONFIG?.encounterRole?.uuid,
          // encounterRole: "240b26f9-dd88-4172-823d-4a8bfeb7841f",
        },
      ],
      orders: [
        {
          orderType: params?.exemptionOrderType,
          action: "NEW",
          urgency: "ROUTINE",
          careSetting: !patientBillingDetails.visit?.isAdmitted
            ? "OUTPATIENT"
            : "INPATIENT",
          patient: params?.currentPatient?.id,
          concept: params?.exemptionConcept,
          orderer: params.provider?.uuid,
          type: "order",
        },
      ],
    };

    const dialog = this.dialog.open(ExemptionConfirmationComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
      data: {
        modelTitle: "Request confirmation",
        modelMessage:
          "This is to confirm that you are requesting exemption  for this patient",
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data?.confirmed) {
        this.ordersService
          .createOrdersViaCreatingEncounter(exemptionEncounterStart)
          .subscribe({
            next: (encounter) => {
              this.hasOpenExemptionRequest = true;
              this.store.dispatch(go({ path: ["/billing"] }));
              return encounter;
            },
            error: (err) => {
              return err;
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
          } </h2>
          <h3>P.O Box ${e.FacilityDetails.postalCode} ${
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
      if (e.Bill.length > 0) {
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

        e.Bill.forEach((bill) => {
          bill.items.forEach((record) => {
            // payable items
            if (!record?.discounted || record.payable > 0) {
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
          <td colspan="2" style ="font-weight:bold; text-align:center">${bill.totalPaymentAmount}</td>
          </tr>`;
          frameDoc.document.write(contents);
        });

        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    // For exempted items
    if (e.Bill) {
      if (e.Bill.length > 0) {
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

        e.Bill.forEach((bill) => {
          bill.items.forEach((record) => {
            //Check for exempted items unexempted items
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
          <td colspan="2" style ="font-weight:bold; text-align:center">${bill.discount}</td>
          </tr>`;
          frameDoc.document.write(contents);
        });

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
    this.trackActionForAnalytics("BillingReceipt");
    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }
}
