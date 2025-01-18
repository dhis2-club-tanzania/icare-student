import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { flatten, keyBy } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { getObservationsFromForm } from "src/app/modules/clinic/helpers/get-observations-from-form.helper";
import { loadCustomOpenMRSForm } from "src/app/store/actions";
import {
  clearObservations,
  saveObservations,
  saveObservationsUsingEncounter,
} from "src/app/store/actions/observation.actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllDiagnoses,
  getCurrentLocation,
  getLocationsByTagName,
  getParentLocation,
  getParentLocationTree,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import {
  getCustomOpenMRSFormById,
  getFormsLoadingState,
} from "src/app/store/selectors/form.selectors";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
} from "src/app/store/selectors/observation.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { OpenMRSForm } from "../../modules/form/models/custom-openmrs-form.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { ICARE_CONFIG } from "../../resources/config";
import { ObservationService } from "../../resources/observation/services";
import { Patient } from "../../resources/patient/models/patient.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { ConfigsService } from "../../services/configs.service";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { RegistrationService } from "src/app/modules/registration/services/registration.services";

@Component({
  selector: "app-capture-form-data-modal",
  templateUrl: "./capture-form-data-modal.component.html",
  styleUrls: ["./capture-form-data-modal.component.scss"],
})
export class CaptureFormDataModalComponent implements OnInit {
  patient: any;
  formUuid: string;
  formLoadingState$: Observable<boolean>;
  form$: Observable<any>;
  formData: any;
  currentEncounterUuid: string;
  currentLocation: any;
  currentObs: any[];
  savingObservations$: Observable<boolean>;
  observations$: Observable<any>;
  privileges: any;
  provider: any;
  visit: any;
  currentLocationUuid: string;
  encounterObject: any;
  deathRegistryFormUuid$: Observable<string>;
  causesOfDeathConcepts: any[];
  showPrintButton: boolean;
  // Change logic to handle is valid (At least use form field required property)
  isValid: boolean = false;

  deathFormFields: any[];
  facilityDetails$: Observable<any>;
  currentUser$: Observable<any>;
  referralFormsConcepts$: Observable<any>;
  observations: any;
  drugsPrescribed: any[];
  diagnoses$: Observable<any>;
  causeOfDeathNonCoded: any;
  causeOfDeath: any;
  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CaptureFormDataModalComponent>,
    private observationService: ObservationService,
    private systemSettingsService: SystemSettingsService,
    private configService: ConfigsService,
    private registrationService: RegistrationService
  ) {
    this.patient = data?.patient?.patient;
    this.formUuid = data?.form?.formUuid;
    this.privileges = data?.privileges;
    this.visit = data?.visit;
    this.provider = data?.provider;
    this.currentLocation = data?.currentLocation;
    this.causesOfDeathConcepts = data?.causesOfDeathConcepts;
    this.observations = data?.observations;
    this.showPrintButton = data?.showPrintButton;
    this.store.dispatch(
      loadCustomOpenMRSForm({
        formUuid: data?.form?.formUuid,
        causesOfDeathConcepts: this.causesOfDeathConcepts,
      })
    );
  }

  ngOnInit(): void {
    this.formLoadingState$ = this.store.select(getFormsLoadingState);
    this.deathRegistryFormUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.deathRegistry.formUuid"
      );
    this.form$ = this.store.select(getCustomOpenMRSFormById(this.formUuid));
    // this.deathRegistryFormUuid$.subscribe((responseFormUuid) => {
    //   if (responseFormUuid) {
    //     this.store
    //       .select(getCustomOpenMRSFormById, {
    //         id: this.formUuid,
    //       })
    //       .subscribe((formResponse) => {
    //         console.log("formResponse", formResponse);
    //       });
    //   }
    // });

    this.formData = {};
    this.savingObservations$ = this.store.pipe(
      select(getSavingObservationStatus)
    );
    this.observations$ = this.store.select(getGroupedObservationByConcept);
    this.referralFormsConcepts$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        "iCare.forms.referralForm"
      );

    this.diagnoses$ = this.store.select(getAllDiagnoses);

    this.drugsPrescribed = this.visit?.otherOrders.filter((order) => {
      if (
        order?.order?.orderType?.uuid ===
        this.data?.generalPrescriptionOrderType
      ) {
        return order;
      }
    });
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onFormUpdate(formValue: FormValue, form): void {
    this.formData = { ...this.formData, ...formValue.getValues() };

    this.isValid =
      (
        Object.keys(this.formData).filter((key) => this.formData[key]?.value) ||
        []
      )?.length > 0;
    this.currentObs = getObservationsFromForm(
      this.formData,
      this.patient?.person?.uuid,
      this.currentLocation?.uuid,
      null
    );
    const fileObs = Object.keys(this.formData)
      .map((key) => {
        if (this.formData[key]?.isFile) {
          return {
            concept: key,
            person: this.patient?.uuid,
            file: this.formData[key]?.value,
          };
        }
      })
      .filter((obs) => obs);
    this.encounterObject = {
      encounterDatetime: new Date(),
      visit: this.visit?.uuid,
      patient: this.patient?.uuid,
      encounterType: form?.encounterType?.uuid,
      location: this.currentLocation?.uuid,
      obs: this.currentObs,
      fileObs: fileObs,
      orders: [],
      encounterProviders: [
        {
          provider: this.provider?.uuid,
          encounterRole: ICARE_CONFIG.encounterRole?.uuid,
        },
      ],
    };
    this.causeOfDeathNonCoded =
      this.formData["37cf2f9d-4e73-46c1-aa60-7088f61b8d85"]?.value;
    this.causeOfDeath =
      this.formData["b61962e7-7972-4945-baf9-75074d531cb9"]?.value;

    // console.log('OBS', obs);
    // console.log('location', location);
  }

  saveCurrentFormData(e: Event, deathRegistryFormUuid: string): void {
    e.stopPropagation();
    this.store.dispatch(
      saveObservationsUsingEncounter({
        data: this.encounterObject,
        patientId: this.patient.uuid,
      })
    );

    if (this.formUuid === deathRegistryFormUuid) {
      // TODO: Mark as deceased
      let patient = {
        ...this.patient,
        person: {
          deathDate: new Date(),
          dead: true,
          causeOfDeath: this.causeOfDeath ? this.causeOfDeath : null,
          causeOfDeathNonCoded: this.causeOfDeath
            ? null
            : this.causeOfDeathNonCoded,
        },
      };
      this.registrationService
        .updatePatient(patient, this.patient?.uuid)
        .subscribe((data) => {
          return data;
        });
    }
    this.dialogRef.close();
  }

  onPrint(e: any) {
    let observations: any[] = [];

    e?.ReferralFormsConcepts?.forEach((concept) => {
      let hasObervation =
        e?.ObservationsGroupedByConcept &&
        e?.ObservationsGroupedByConcept[concept?.value]
          ? true
          : false;

      if (hasObervation) {
        observations = [
          ...observations,
          e?.ObservationsGroupedByConcept[concept?.value],
        ];
      }
    });

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
            @page { size: auto;  margin: 10mm; }
            .container {
              margin: 20px;
              align-items: center;
              width: 90%;
            }
            .row {
              display: flex;
              flex-direction: column column;
            }
            .text-small {
              font-size: 1em;
            }
            .text-medium {
              font-size: 1.5em;
            }
            .text-large {
              font-size: 2em;
            }
            .mt-s {
              margin-top: 3vh;
            }
            .head {
              width: 70%;
              text-align: center;
              margin: 0 0 0 20vw;
            }
            .logo img{
              margin-left: 60vw;
              height: 20vh;
              width: 20vw;
            }
            .details {
              position: relative;
              top: -15vh;
              margin-bottom: -15vh;
            }
            .details-1 {
              margin: 0 0 0 5vw;
            }
            .details-2 {
              margin: 0 0 0 60vw;
            }
            .ml-5 {
              margin-left: 20vw;
            }
            .text-center {
              text-align: center;
            }
            .mini-head {
              text-align: center;
              margin-left: 55vw;
            }
            .content {
              margin: 0 0 0 5vw;
            }

            #table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 80%;
                background-color: #000;
              } 
              #table td, #table  th {
                border-bottom: 1px solid #ddd;
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

            .footer-content-1{
              margin: 0 0 0 5vw;
            }
            .footer-content-2{
              margin: 0 0 0 7vw;
            }
            .footer-content-3{
              margin: 0 0 0 7vw;
            }
          </style>
        </head>
        <body>
        <div id="printOut">
      `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";

    e?.FacilityDetails?.attributes.map((attribute) => {
      let attributeTypeName =
        attribute && attribute?.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
    });

    //Declare strings to carry HTML associated with them
    let drugs: string = "";
    let observation: string = "";
    let provisionalDiagnoses: string = "";
    let confirmedDiagnoses: string = "";
    let labOrders: string = "";
    let proceduresOrders: string = "";
    let radiologyOrders: string = "";

    // Counters related to each HTML generated
    let drugsCounter = 1;
    let obsCounter = 1;
    let provisionalDiagnosesCounter = 1;
    let confirmedDiagnosesCounter = 1;
    let labOrdersCounter = 1;
    let radiologyOrdersCounter = 1;
    let proceduresOrdersCounter = 1;

    //Loop over data to generate HTML table data
    this.drugsPrescribed.forEach((drug) => {
      drugs =
        drugs +
        `
        <tr>
          <td>${drugsCounter}</td>
          <td>${drug?.order?.display}</td>
        </tr>
      `;
      drugsCounter = drugsCounter + 1;
    });

    observations.forEach((observation) => {
      observation =
        observation +
        `
        <tr>
          <td>${obsCounter}</td>
          <td>${observation?.latest?.value}</td>
        </tr>
      `;
      obsCounter = obsCounter + 1;
    });

    e?.Diagnoses.forEach((diagnosis) => {
      if (diagnosis?.certainty === "PROVISIONAL") {
        provisionalDiagnoses =
          provisionalDiagnoses +
          `
          <tr>
            <td>${provisionalDiagnosesCounter}</td>
            <td>${diagnosis?.display}</td>
          </tr>
          `;
        provisionalDiagnosesCounter = provisionalDiagnosesCounter + 1;
      }
    });

    e?.Diagnoses.forEach((diagnosis) => {
      if (diagnosis?.certainty === "CONFIRMED") {
        confirmedDiagnoses =
          confirmedDiagnoses +
          `
          <tr>
            <td>${confirmedDiagnosesCounter}</td>
            <td>${diagnosis?.display}</td>
          </tr>
        `;
        confirmedDiagnosesCounter = confirmedDiagnosesCounter + 1;
      }
    });

    this.visit.labOrders.forEach((labOrder) => {
      labOrders =
        labOrders +
        `
        <tr>
          <td>${labOrdersCounter}</td>
          <td>${labOrder?.order?.display}</td>
        </tr>
      `;
      labOrdersCounter = labOrdersCounter + 1;
    });

    this.visit.procedureOrders.forEach((procedureOrder) => {
      proceduresOrders =
        proceduresOrders +
        `
        <tr>
          <td>${proceduresOrdersCounter}</td>
          <td>${procedureOrder?.order?.display}</td>
        </tr>
      `;
      proceduresOrdersCounter = proceduresOrdersCounter + 1;
    });

    this.visit.radiologyOrders.forEach((radiologyOrder) => {
      radiologyOrders =
        radiologyOrders +
        `
        <tr>
          <td>${radiologyOrdersCounter}</td>
          <td>${radiologyOrder?.order?.display}</td>
        </tr>
      `;
      radiologyOrdersCounter = radiologyOrdersCounter + 1;
    });

    //Generate contents to be placed in HTML form to be generated

    drugs =
      drugs.length > 0
        ? `
        <div>
            <h5>Drugs Prescribed</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${drugs}
            </tbody>
          </table>`
        : drugs;

    observation =
      observation.length > 0
        ? `
        <div>
            <h5>Clinical Notes and Examination Findings</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${observation}
            </tbody>
          </table>`
        : observation;

    provisionalDiagnoses =
      provisionalDiagnoses.length > 0
        ? `
        <div>
            <h5>Provisional Diagnoses</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${provisionalDiagnoses}
            </tbody>
          </table>`
        : provisionalDiagnoses;

    confirmedDiagnoses =
      confirmedDiagnoses.length > 0
        ? `
        <div>
            <h5>Confirmed Diagnoses</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${confirmedDiagnoses}
            </tbody>
          </table>`
        : confirmedDiagnoses;

    labOrders =
      labOrders.length > 0
        ? `
        <div>
            <h5>Laboratory</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${labOrders}
            </tbody>
          </table>`
        : labOrders;
    proceduresOrders =
      proceduresOrders.length > 0
        ? `
        <div>
            <h5>Procedures</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${proceduresOrders}
            </tbody>
          </table>`
        : proceduresOrders;
    radiologyOrders =
      radiologyOrders.length > 0
        ? `
        <div>
            <h5>Radiology</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${radiologyOrders}
            </tbody>
          </table>`
        : radiologyOrders;

    frameDoc.document.write(`
        <div class="container">
        <div class="row">
          <div class="head text-medium">
            <h2>${e?.FacilityDetails?.display.toUpperCase()}</h2>
          </div>
        </div>
        <div class="logo">
          <img src="${image}" alt="UDSM DHIS2 Logo" />
        </div>
        <div class="row details text-small">
          <div class="details-1">
            <p>P.O Box ${e?.FacilityDetails?.postalCode}, ${
      e?.FacilityDetails?.stateProvince
    }</p>
            <p>Direct: ............................................</p>
            <p>Email: ...........................................</p>
          </div>
          <div class="details-2">
            <p>Hospital Reg Number:........................................</p>
            <p>
              Surname: ${e?.CurrentPatient?.lname}
            </p>
            <p>
              Other Names: ${e?.CurrentPatient?.fname} ${
      e?.CurrentPatient?.mname
    }
            </p>
            <p>
              Address:
              .............................................................
            </p>
            <p>
              Age: ${e?.CurrentPatient?.age} Sex: ${e?.CurrentPatient?.gender}
            </p>
            <p>
              Patient Relative Tel
              Number:..........................................
            </p>
          </div>
        </div>
        <div class="row text-center">
          <div class="mini-head">
            <h2>REFERRAL FORM</h2>
          </div>
        </div>
        <div class="row">
          <div class="content">
            <p>
              <strong>Refer to</strong>
              .............................................................................................................................................................................................................................................................................
            </p>
            <p>
              <strong>Clinical Notes and Examination Findings</strong>
              ${observation}
            </p>
            <p>
              <strong>Provisinal / Definitive diagnosis</strong>
              ${provisionalDiagnoses} 
              ${confirmedDiagnoses}
              ${labOrders}
              ${radiologyOrders}
            </p>
            <p>
              <strong>Treatment Given</strong>
              ${drugs}
              ${proceduresOrders}
            </p>
            <p>
              <strong>Reasons for referral</strong>
              ....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
            </p>
            <p>
              <strong>Refer to</strong>
              ....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
              <p>
                  .........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
              </p>
            </p>
          </div>
        </div>
      `);

    frameDoc.document.write(`
      <div class="row">
        <div class="footer-1 row">
            <div class="footer-content-1 text-center">
                <p>...............................................................................</p>
                <p>Referring Doctor's Name</p>
            </div>
            <div class="footer-content-2 text-center">
                <p>...............................................................................</p>
                <p>Designation</p>
            </div>
            <div class="footer-content-3 text-center">
                <p>...............................................................................</p>
                <p>Signature</p>
            </div>
        </div>
      </div>
      <div class="row">
          <div class="footer-2">
          <p><strong>Handover to: </strong>.........................................................................................................................</p>
          <p><strong>Handed over by: </strong>...................................................................................................................</p>
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
