import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { go, loadCustomOpenMRSForm } from "src/app/store/actions";
import { updateVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { VisitsService } from "../../resources/visits/services";
import { Observable } from "rxjs";
import { getParentLocation } from "src/app/store/selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ObservationService } from "../../resources/observation/services";
import {
  formatDateToString,
  formatDateToYYMMDD,
} from "../../helpers/format-date.helper";
import { getAllDiagnosesFromVisitDetails } from "../../helpers/patient.helper";
import { Diagnosis } from "../../resources/diagnosis/models/diagnosis.model";

@Component({
  selector: "app-discharge-patient-modal",
  templateUrl: "./discharge-patient-modal.component.html",
  styleUrls: ["./discharge-patient-modal.component.scss"],
})
export class DischargePatientModalComponent implements OnInit {
  visitDetails: any;
  dischargeObjects: any = {};
  savingData: boolean = false;
  showInvoiceDetails: boolean = false;
  parentLocation$: Observable<any>;
  logoLocationAttributeTypeUuid$: Observable<string>;
  errors: any[] = [];
  // TODO: Softcode this form uid using system settings
  dischargeFormUuid: string = "d5a59a6c-87f7-4edf-a74a-5902adcce67f";
  observationData: any;
  dateOfDischarge: Date = new Date();
  dischargeSummaryNotesFed: boolean = false;
  visit$: Observable<any>;
  readyToConfirmDischarge: boolean = false;
  diagnoses: any[] = [];
  constructor(
    private dialogRef: MatDialogRef<DischargePatientModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private visitService: VisitsService,
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private observationService: ObservationService
  ) {
    this.visitDetails = data;
    // console.log(this.visitDetails);
  }

  ngOnInit(): void {
    this.store.dispatch(
      loadCustomOpenMRSForm({ formUuid: this.dischargeFormUuid })
    );
    this.logoLocationAttributeTypeUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCareConnect.configurations.location.logoAttribute.uuid`
      );
    this.logoLocationAttributeTypeUuid$.subscribe((response: any) => {
      if (response && response === "none") {
        this.errors = [
          ...this.errors,
          {
            error: {
              error:
                "Key iCareConnect.configurations.location.logoAttribute.uuid as not available, contact IT",
              message:
                "Key iCareConnect.configurations.location.logoAttribute.uuid as not available, contact IT",
            },
          },
        ];
        
      }
    });
    console.log("here in parentLocation .........................");
    this.parentLocation$ = this.store.select(getParentLocation);
    this.dischargeObjects = {
      visitDetails: {
        location: "6351fcf4-e311-4a19-90f9-35667d99a8af",
        uuid: this.visitDetails?.uuid,
      },
      encounterDetails: {
        patient: this.visitDetails?.patient["uuid"],
        location: this.visitDetails?.location?.uuid,
        visit: this.visitDetails?.uuid,
        provider: this.visitDetails?.provider?.uuid,
        encounterType: "181820aa-88c9-479b-9077-af92f5364329",
      },
    };
    this.getVisit();
  }

  getVisit(): void {
    this.visit$ = this.visitService.getActiveVisit(
      this.visitDetails?.patient?.uuid,
      false
    );
  }
  

  onGetConfirmDischargeStatus(confirm: boolean): void {
    console.log("onGetConfirmDischargeStatus ......................",confirm);
    this.readyToConfirmDischarge = confirm;
  }

  onGetObservationData(obsData: any): void {
    this.observationData = obsData;
    this.dischargeSummaryNotesFed =
      (
        Object.keys(obsData)?.filter(
          (key: string) => this.observationData[key]?.value
        ) || []
      )?.length > 0;
  }

  onSaveDischargeSummary(event: Event): void {
    event.stopPropagation();
    const data = {
      encounterDatetime: this.visitDetails?.admissionEncounter?.encounterDatetime,
      patient : this.visitDetails?.patient?.uuid,
      encounterUuid: this.visitDetails?.admissionEncounter?.uuid,
      location: this.visitDetails?.location?.uuid,
      encounterProviders:[
        {
          provider: this.visitDetails?.provider?.uuid,
          encounterRole: this.visitDetails?.admissionEncounter?.uuid,
        }
      ],
      visit: this.visitDetails?.uuid,
      obs: ( Object.keys(this.observationData)?.map((key: string) => {
        const observation = this.observationData[key];
        if (observation && observation.value) {
          return {
            person: this.visitDetails?.patient?.uuid,
            concept: key,
            obsDatetime: new Date(),
            // form: this.dischargeFormUuid,
            value: observation.value,
          };
        } else {
          return null; 
        }
      }).filter((observation: any) => observation)
      ),
      form: this.dischargeFormUuid,
      orders:[],
    };
    this.savingData = true;
    this.observationService
      .saveObservationsViaEncounter(data)
      .subscribe((response: any) => {
        if (response) {
          console.log("response ............................",response);
          this.getVisit();
          this.savingData = false;
        }
      });
  }
  onPrint(event: Event, parentLocation: any, activeVisit: any): void {
    event.stopPropagation();
    this.diagnoses = getAllDiagnosesFromVisitDetails(activeVisit);
    this.diagnoses =
      this.diagnoses?.filter(
        (diagnosis: Diagnosis) => diagnosis?.isConfirmedDiagnosis
      ) || [];
    let printingDate = formatDateToString(new Date());

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
                  width: 850px;
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
                  font-size: 1em;
                }
                p {
                  font-size: 1em;
                }
                #table {
                  font-family: Arial, Helvetica, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                  background-color: #000;
                }
                table {
                  border-collapse: collapse;
                }
                table td, table  th {
                  padding: 5px;
                }
                .contents th,.contents td {
                  border: 1px solid #dee2e6;
                }

                #table tbody tr:nth-child(even){
                  background-color: #f2f2f2;
                }

                #table thead tr th {
                  padding-top:6px;
                  padding-bottom: 6px;
                  text-align: left;
                  background-color: #cecece;
                  font-size: 1em;
                }
                tbody tr td, tbody tr th {
                  font-size: 1em;
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
           <div id="discharge-summary">
          `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";

    parentLocation?.attributes?.map((attribute) => {
      let attributeTypeName =
        attribute && attribute.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
    });

    frameDoc.document.write(`
 <table style="width: 100%">
  <tbody>
    <tr>
      <td style="width: 40%">
        <p style="text-align: left; margin-botton: 0;">
          ${parentLocation?.display?.toUpperCase()}
        </p>
        <p style="text-align: left; margin-botton: 0;">
        ${parentLocation?.description}
        </p>
        <p style="text-align: left; margin-botton: 0;">
        P.O Box ${parentLocation?.postalCode} ${parentLocation?.stateProvince}
        </p>
        <p style="text-align: left; margin-botton: 0;">${
          parentLocation?.country
        }</p>
      </td>
      <td style="width: 20%">
        <div style="text-align: center">
          <img height="80" src="${image}"  alt="Facility's Logo" />
        </div>
      </td>
      <td style="width: 40%">
      <p style="text-align: right; margin-botton: 0;">
        Hospital Reg. No.: ${
          (this.visitDetails?.patient?.identifiers?.filter(
            (identifier: any) => identifier?.preferred
          ) || [])[0]?.identifier
        }
        </p>
        <p style="text-align: right; margin-botton: 0;">
        Surname: ${
          this.visitDetails?.patient?.person?.preferredName?.familyName
        }
        </p>

        <p style="text-align: right; margin-botton: 0;">
        Other names: ${
          this.visitDetails?.patient?.person?.preferredName?.givenName
        } ${this.visitDetails?.patient?.person?.preferredName?.middleName}
        </p>

        <p style="text-align: right; margin-botton: 0;">
        <span>
        DoB/Age: ${formatDateToYYMMDD(
          new Date(this.visitDetails?.patient?.person?.birthdate)
        )}/${this.visitDetails?.patient?.person?.age}yrs
        </span>
        <span>
        Sex: ${this.visitDetails?.patient?.person?.gender}
        </span>
        </p>
      </td>
    </tr>
  </tbody>
</table>`);

    //For paid items
    let title = "Discharge Summary";
    frameDoc.document.write(`
          <div style="text-align: center">
            <h4>${title}</h4>
          </div>
    <table class="contents" style="width: 100%">
    <tbody>
      <tr>
        <td style="width: 25%">Name of Admitting Doctor:</td>
        <td style="width: 25%">
          ${
            this.visitDetails?.admissionEncounter?.encounterProviders[0]?.provider?.display?.split(
              "-"
            )[1]
          }
        </td>
        <td style="width: 25%">Date of Admission</td>
        <td style="width: 25%">
        ${formatDateToYYMMDD(
          new Date(this.visitDetails?.admissionEncounter?.encounterDatetime)
        )}: 
        ${new Date(
          this.visitDetails?.admissionEncounter?.encounterDatetime
        ).toLocaleTimeString()}
        </td>
      </tr>
      <tr>
        <td  style="width: 25%">Name of Discharging Doctor:</td>
        <td style="width: 25%"></td>
        <td style="width: 25%">Discharging Date</td>
        <td style="width: 25%">
          ${formatDateToYYMMDD(
            new Date(this.dateOfDischarge)
          )}: ${this.dateOfDischarge.toLocaleTimeString()} 
        </td>
      </tr>
      <tr>
        <th colspan="2">Diagnosis of Discharge</th>
        <th colspan="2">Treatment Given</th>
      </tr>
      ${[0, 1, 2, 3]
        .map((index: number) => {
          return `<tr>
        <td style="text-align: left" colspan="2">${index + 1}.${
            this.diagnoses[index] ? this.diagnoses[index]?.display : ""
          }</td>
        <td style="text-align: left" colspan="2"></td>
      </tr>`;
        })
        .join("")}
      
    </tbody>
  </table>`);

    Object.keys(this.observationData).forEach((key: string) => {
      if (this.observationData[key]?.value) {
        frameDoc.document.write(`
        <p style="text-align: left">${this.observationData[key]?.label}: ${this.observationData[key]?.value}</p>`);
      }
    });

    frameDoc.document.write(`
        <table style="width: 100%">
          <tbody>
            <tr>
              <td colspan="3">
              Fitness for Duty: 
              </td>
              <td>
              Signature: ............ 
              </td>
            </tr>
          </tbody>
        </table>`);

    frameDoc.document.write(`
            <div class="footer">
              <div class="userDetails">
                <p class="name">Printed By: ${this.visitDetails?.currentUser?.person?.display}
                <span>
                Printed on: ${printingDate}
                </span>
                </p>
              </div>

              <div class=""printDate>
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

  onConfirm(event: Event, dischargeObjects) {
    event.stopPropagation();
    this.savingData = true;
    this.visitService
      .dischargePatient(dischargeObjects?.encounterDetails)
      .subscribe((response) => {
        if (response) {
          this.savingData = false;
          this.store.dispatch(
            updateVisit({
              details: dischargeObjects?.visitDetails,
              visitUuid: dischargeObjects.visitDetails?.uuid,
            })
          );
          setTimeout(() => {
            this.store.dispatch(go({ path: ["/inpatient"] }));
          }, 200);
        }
      });
    this.dialogRef.close(true);
  }

  toggleInvoiceDetails(event: Event, invoice: any): void {
    event.stopPropagation();
    this.showInvoiceDetails = !this.showInvoiceDetails;
  }
}

 // onSaveDischargeSummary(event: Event): void {
  //   event.stopPropagation();
  //   const data = {
  //     encounterUuid: this.visitDetails?.admissionEncounter?.uuid,
  //     obs: (
  //       Object.keys(this.observationData)?.map((key: string) => {
  //         return {
  //           person: this.visitDetails?.patient?.uuid,
  //           concept: key,
  //           obsDatetime: new Date(),
  //           form: this.dischargeFormUuid,
  //           value: this.observationData[key]?.value,
  //         };
  //       }) || []
  //     )?.filter((observation: any) => observation?.value),
  //   };
  //   console.log("data summary discharge ......................",data)
  //   this.savingData = true;
  //   this.observationService
  //     .saveObservationsViaEncounter(data)
  //     .subscribe((response: any) => {
  //       if (response) {
  //         this.getVisit();
  //         this.savingData = false;
  //       }
  //     });
  // }