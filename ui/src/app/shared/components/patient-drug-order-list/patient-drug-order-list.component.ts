import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DispensingFormComponent } from "src/app/shared/dialogs/dispension-form/dispension-form.component";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getIfThereIsAnyDiagnosisInTheCurrentActiveVisit,
  getParentLocation,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";
import { formatDateToString } from "../../helpers/format-date.helper";
import { TableActionOption } from "../../models/table-action-options.model";
import { TableColumn } from "../../models/table-column.model";
import { TableConfig } from "../../models/table-config.model";
import { TableSelectAction } from "../../models/table-select-action.model";
import { DrugOrdersService } from "../../resources/order/services";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";
import { ConfigsService } from "../../services/configs.service";

@Component({
  selector: "app-patient-drug-order-list",
  templateUrl: "./patient-drug-order-list.component.html",
  styleUrls: ["./patient-drug-order-list.component.scss"],
})
export class PatientDrugOrderListComponent implements OnInit {
  @Input() currentLocation: any;
  @Input() visit: Visit;
  @Input() loading: boolean;
  @Input() loadingError: string;
  @Input() encounterUuid: string;
  @Input() actionOptions: TableActionOption[];
  @Input() canAddPrescription: boolean;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  visitLoadingState$: Observable<boolean>;

  drugOrderColumns: TableColumn[];
  tableConfig: TableConfig;
  @Output() orderSelectAction = new EventEmitter<TableSelectAction>();
  isThereDiagnosisProvided$: Observable<boolean>;
  drugOrders$: Observable<any>;
  facilityLogo$: Observable<any>;
  facilityDetails$: Observable<any>;
  currentLocation$: Observable<any>;
  currentUser$: Observable<any>;
  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private drugOrderService: DrugOrdersService,
    private ordersService: OrdersService,
    private configService: ConfigsService
  ) {}

  ngOnInit() {
    this.drugOrders$ = this.ordersService.getOrdersByVisitAndOrderType({
      visit: this.visit?.uuid,
      orderType: "iCARESTS-PRES-1111-1111-525400e4297f",
    });
    this.visitLoadingState$ = this.store.select(getVisitLoadingState);
    this.tableConfig = new TableConfig({ noDataLabel: "No prescription" });
    this.drugOrderColumns = [
      {
        id: "orderNumber",
        label: "#",
      },
      {
        id: "display",
        label: "Item",
      },
      {
        id: "orderedBy",
        label: "Ordered by",
      },
      {
        id: "quantity",
        label: "Quantity",
      },
      {
        id: "price",
        label: "Price",
      },
      {
        id: "paymentStatus",
        label: "Status",
      },
    ];
    this.isThereDiagnosisProvided$ = this.store.select(
      getIfThereIsAnyDiagnosisInTheCurrentActiveVisit
    );
    this.facilityLogo$ = this.configService.getLogo();
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  onSelectAction(data: any) {
    this.orderSelectAction.emit(data);
  }

  onPrintPrescriptions(drugOrders, e: any) {
    let contents: string;

    const frame1: any = document.createElement("iframe");
    frame1.name = "frame1";
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
                width: 150mm;
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
                display: flex;
                margin-top:50px;
              }
              .footer .doctorDetails .signature {
                margin-top: 10px;
              }
              .footer .userDetails {
                margin-left: 10vw;
              }
              .footer .userDetails .signature {
                margin-top: 10px;
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

    //Prescriptions
    if (drugOrders.length > 0) {
      frameDoc.document.write(`
      <div>
        <h5>Dispensed Prescriptions</h5>
      </div>
      <table id="table">
        <thead>
          <tr>
            <th>Drug</th>
            <th>Instructions</th>
            <th>Quantity</th>
            <th>Prescription Date</th>
          </tr>
        </thead>
        <tbody>`);

      drugOrders.forEach((order) => {
        contents = `
              <tr>
                <td>${order?.drug?.display}</td> 
                <td>${order?.instructions || "No instructions"}</td>  
                <td>${order?.quantity}</td>
                <td>${formatDateToString(
                  new Date(order?.dateActivated),
                  "DD-MM-YYYY"
                )}</td>
              </tr>`;
        frameDoc.document.write(contents);
      });

      frameDoc.document.write(`
        </tbody>
      </table>`);
    }

    frameDoc.document.write(`
          <div class="footer">
            <div class="doctorDetails">
              <p class="name">Doctor: ${drugOrders[0]?.orderer?.display}</p>
              <p class="signature">Signature : ..............................</p>
            </div>
            <div class="userDetails">
              <p class="name">Printed By: ${e.CurrentUser?.person?.display}</p>
              <p class="signature">Signature : ..............................</p>
            </div>
          </div>
          <div class=""printDate>
            <p>Printed on: ${formatDateToString(new Date(), "DD-MM-YYYY")}</p>
          </div>
        </div>
      </body>
    </html>`);

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      document.body.removeChild(frame1);
    }, 500);
  }

  onAddOrder(e: MouseEvent) {
    e.stopPropagation();
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: "80%",
      disableClose: true,
      data: {
        drugOrder: null,
        patient: this.visit?.patient,
        visit: this.visit,
        location: this.currentLocation,
        encounterUuid: this.encounterUuid,
        fromDispensing: true,
        showAddButton: false,
      },
    });
  }
}
