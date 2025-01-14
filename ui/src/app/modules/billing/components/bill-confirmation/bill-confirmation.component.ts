import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { random } from "lodash";
import { Observable } from "rxjs";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { BillingService } from "../../services/billing.service";

@Component({
  selector: "app-bill-confirmation",
  templateUrl: "./bill-confirmation.component.html",
  styleUrls: ["./bill-confirmation.component.scss"],
})
export class BillConfirmationComponent implements OnInit {
  controlNumber?: number;
  generatingControlNumber: boolean;
  savingPayment: boolean;
  savingPaymentError: string;
  facilityDetailsJson: any;
  facilityLogoBase64: string;
  currentUser: any;
  gepgConceptField$: Observable<any>;
  isFormValid: boolean;
  formValues: any;

  constructor(
    private matDialogRef: MatDialogRef<BillConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private billingService: BillingService,
    private store: Store<AppState>,
    private conceptService: ConceptsService
  ) {}

  ngOnInit(): void {
    this.gepgConceptField$ = this.conceptService.getConceptDetailsByUuid(
      this.data?.gepgConceptUuid
    );
    this.facilityDetailsJson = this.data?.facilityDetails
      ? this.data?.facilityDetails
      : null;

    this.facilityLogoBase64 =
      this.data?.logo?.results?.length > 0
        ? this.data?.logo?.results[0]?.value
        : null;

    const gepgrequestpayload = {
      selectedbills: this.data.billItems.map((item: any) => ({ bill: item.bill })),
      uuid: this.data.currentPatient.patient.uuid,
      totalBill: this.data.totalPayableBill
    };
    const generateControlNoPayload = this.data.billItems.map((item: any) => ({
      uuid: this.data.currentPatient.patient.uuid,
      currency: "Tzs"
    }));
  
    console.log("Formatted payload:", generateControlNoPayload);
    //Calling Controll number Generation Function
    this.onConntrollNumbGen(generateControlNoPayload);
    this.currentUser = this.store.select(getCurrentUserDetails).subscribe({
      next: (currentUser) => {
        return currentUser;
      },

      error: (error) => {
        throw error;
      },
    });
  }
   
  get controlNumberValue(): string {
    return `GEPG_MNL: ${this.controlNumber}`;
  }

   onConntrollNumbGen(payload){
    this.billingService
      .gepgpayBill(payload)
      .subscribe(
        (paymentResponse) => {
          // console.log("successfully generated .......",paymentResponse);
          this.matDialogRef.close(paymentResponse);
               
        },
        (error) => {
         console.log("Fail to Generate Control Number .....",error);
          this.savingPaymentError = error;
        }
      );
   }


  onFormUpdate(formValues: FormValue): void {
    this.isFormValid = formValues.isValid;
    this.formValues = { ...this.formValues, ...formValues.getValues() };

    // Test controlNumber against regex to validate
    const correntCN = new RegExp("\\d{11,}").test(
      String(formValues.getValues()[this.data?.gepgConceptUuid]?.value)
    );
    if (correntCN) {
      this.controlNumber = Number(
        formValues.getValues()[this.data?.gepgConceptUuid]?.value
      );
    } else {
      this.controlNumber = undefined;
    }
  }

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();
    this.savingPayment = true;
    this.billingService
      .payBill(this.data?.bill, {
        confirmedItems: this.data?.billItems,
        items: this.data?.items,
        paymentType: this.data?.paymentType,
        referenceNumber: "",
      })
      .subscribe(
        (paymentResponse) => {
          this.savingPayment = false;
          this.matDialogRef.close(paymentResponse);
        },
        (error) => {
          this.savingPayment = false;
          this.savingPaymentError = error;
        }
      );
  }

  onGenerateControlNumber(e): void {
    e.stopPropagation();
    this.generatingControlNumber = true;
    setTimeout(() => {
      this.controlNumber = random(99000000000, 99999999999);
      this.generatingControlNumber = false;
    }, 1000);
  }

  onGepgConfirmation(e): void {
    e.stopPropagation();
    this.savingPayment = false;
    this.billingService
      .payBill(this.data?.bill, {
        confirmedItems: this.data?.billItems,
        items: this.data?.items,
        paymentType: this.data?.paymentType,
        referenceNumber: this.controlNumberValue,
      })
      .subscribe(
        (paymentResponse) => {
          this.savingPayment = false;
          this.matDialogRef.close(paymentResponse);
        },
        (error) => {
          this.savingPayment = true;
          this.savingPaymentError = error;
        }
      );
  }

  onPrint(e): void {
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
          <h3>P.O Box ${e.FacilityDetails?.postalCode} ${
      e.FacilityDetails?.stateProvince
    }</h3>
          <h3>${e?.FacilityDetails?.country}</h3>
        </div>
        <!--End Info-->
      </center>
      <!--End Document top-->
      
      
      <div id="mid">
        <div class="patient-info">
          <p> 
              Patient Name : ${e.CurrentPatient?.name}</br>
          </p>
          <p> 
              MRN : ${patientMRN}</br>
          </p>
        </div>
      </div>`);

    frameDoc.document.write(`
        <div style="margin-top: 50px">
          <p style="font-size: 1em">Control Number: ${this.controlNumber}</>
        </div>
    `);

    frameDoc.document.write(`
          <div class="footer">
            <div class="userDetails">
              <p class="name">Printed By: ${e.CurrentUser?.person?.display}</p>
              <p class="signature">Signature : ..............................</p>
            </div>

            <div class=""printDate>
              <p>Printed on: ${e?.PrintingDate}</p>
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

    this.matDialogRef.close();
  }
}
