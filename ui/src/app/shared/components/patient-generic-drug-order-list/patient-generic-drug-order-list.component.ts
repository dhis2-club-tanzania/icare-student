import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { DispensingFormComponent } from "src/app/shared/dialogs/dispension-form/dispension-form.component";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getIfThereIsAnyDiagnosisInTheCurrentActiveVisit,
  getParentLocation,
} from "src/app/store/selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";
import { TableActionOption } from "../../models/table-action-options.model";
import { TableColumn } from "../../models/table-column.model";
import { TableConfig } from "../../models/table-config.model";
import { TableSelectAction } from "../../models/table-select-action.model";
import { DrugOrdersService } from "../../resources/order/services";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";

import { flatten, keyBy } from "lodash";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { map, tap } from "rxjs/operators";
import { Api } from "../../resources/openmrs";
import { arrangeDrugDetails } from "../../helpers/drugs.helper";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { formatDateToString } from "../../helpers/format-date.helper";
import { ConfigsService } from "../../services/configs.service";

@Component({
  selector: "app-patient-generic-drug-order-list",
  templateUrl: "./patient-generic-drug-order-list.component.html",
  styleUrls: ["./patient-generic-drug-order-list.component.scss"],
})
export class PatientGenericDrugOrderListComponent implements OnInit {
  @Input() currentLocation: any;
  @Input() visit: Visit;
  @Input() loading: boolean;
  @Input() loadingError: string;
  @Input() encounterUuid: string;
  @Input() actionOptions: TableActionOption[];
  @Input() canAddPrescription: boolean;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  @Input() genericPrescriptionOrderType: any;
  @Input() genericPrescriptionEncounterType: any;
  @Input() useGenericPrescription: boolean;
  visitLoadingState$: Observable<boolean>;

  drugOrderColumns: TableColumn[];
  tableConfig: TableConfig;
  isThereDiagnosisProvided$: Observable<boolean>;
  drugOrders$: Observable<any>;
  drugOrders: any[];
  isDispensed?: boolean;

  drugOrdersKeyedByEncounter: any = {};

  @Output() orderSelectAction = new EventEmitter<TableSelectAction>();
  @Output() loadPatientVisit = new EventEmitter<any>();
  genericPrescriptionConceptUuids$: any;
  specificDrugConceptUuid$: Observable<string>;
  errors: any[] = [];
  encounter$: Observable<any>;
  prescriptionArrangementFields$: Observable<any>;
  facilityLogo$: any;
  facilityDetails$: Observable<any>;
  currentUser$: Observable<any>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private configService: ConfigsService
  ) {}

  ngOnInit() {
    this.getDrugOrders();

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

    this.genericPrescriptionConceptUuids$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey("iCare.clinic.genericPrescription.field")
      .pipe(
        map((response: any) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );

    this.specificDrugConceptUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.specificDrugConceptUuid"
      )
      .pipe(
        tap((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Use Specific drug Concept config is missing, Set 'iCare.clinic.genericPrescription.specificDrugConceptUuid' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
        })
      );

    this.prescriptionArrangementFields$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.prescription.arrangement")
      .pipe(
        map((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Arrangement setting isn't defined, Set 'iCare.clinic.prescription.arrangement' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
          if (response?.error) {
            this.errors = [...this.errors, response?.error];
          }
          return {
            ...response,
            keys: Object.keys(response).length,
          };
        })
      );

    this.facilityLogo$ = this.configService.getLogo();
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  getDrugOrders() {
    this.drugOrders = flatten(
      this.visit?.encounters
        ?.map((encounter) => {
          encounter?.orders?.forEach((order) => {
            if (
              order?.orderType?.javaClassName ===
              "org.openmrs.module.icare.billing.models.Prescription"
            ) {
              this.drugOrdersKeyedByEncounter[order?.encounter?.uuid] = order;
            }
          });
          return (
            encounter?.orders.filter(
              (order) =>
                order.orderType?.uuid == this.genericPrescriptionOrderType
            ) || []
          )?.map((genericDrugOrder) => {
            return {
              ...genericDrugOrder,
              formulatedDescription: (
                encounter?.obs?.map((observation) => observation?.value) || []
              ).join(";"),
              obs: keyBy(
                encounter?.obs?.map((observation) => {
                  return {
                    ...observation,
                    conceptKey: observation?.concept?.uuid,
                    valueIsObject: observation?.value?.uuid ? true : false,
                  };
                }),
                "conceptKey"
              ),
            };
          });
        })
        ?.filter((order) => order) || []
    );

    this.drugOrders = this.drugOrders?.filter(
      (order) => !this.drugOrdersKeyedByEncounter[order?.encounter?.uuid]
    );
  }

  onVerify(
    order: any,
    specificDrugConceptUuid: any,
    prescriptionArrangementFields: any
  ) {
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: "100%",
      disableClose: true,
      data: {
        drugOrder: order,
        patient: this.visit?.visit?.patient,
        visit: this.visit,
        location: this.currentLocation,
        encounterUuid: this.encounterUuid,
        drugInstructions: arrangeDrugDetails(
          order,
          specificDrugConceptUuid,
          prescriptionArrangementFields
        )?.description,
        fromDispensing: true,
        showAddButton: false,
        useGenericPrescription: this.useGenericPrescription,
      },
    });

    dialog.afterClosed().subscribe(() => {
      order.isDispensed=true;
      // this.store.dispatch(
      //   loadActiveVisit({ patientId: this.visit?.visit?.patient?.uuid })
      // );
      this.loadPatientVisit.emit();
    });
  }

  onPrintPrescriptions(
    event: Event,
    drugOrders: any,
    specificDrugConceptUuid: any,
    prescriptionArrangementFields: any,
    e: any
  ) {
    event?.stopPropagation();

    //Reconstruct drug details first
    const orders = drugOrders?.map((order) =>
      arrangeDrugDetails(
        order,
        specificDrugConceptUuid,
        prescriptionArrangementFields
      )
    );

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
    if (orders.length > 0) {
      frameDoc.document.write(`
      <div>
        <h5>Prescriptions (Not Despensed)</h5>
      </div>
      <table id="table">
        <thead>
          <tr>
            <th>Drug</th>
            <th>Instructions</th>
            <th>Prescription Date</th>
          </tr>
        </thead>
        <tbody>`);

      orders.forEach((order) => {
        contents = `
              <tr>
                <td>${order?.name}</td> 
                <td>${order?.description}</td>  
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
              <p class="name">Authorized by: ..............................</p>
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
}
