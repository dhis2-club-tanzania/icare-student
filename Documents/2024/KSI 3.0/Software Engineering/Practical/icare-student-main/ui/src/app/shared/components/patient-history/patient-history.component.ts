import { Component, Inject, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { VisitsService } from "../../resources/visits/services/visits.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getAllForms, getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-patient-history",
  templateUrl: "./patient-history.component.html",
  styleUrls: ["./patient-history.component.scss"],
})
export class PatientHistoryComponent implements OnInit {
  @Input() patient: any;
  @Input() location: any;

  visits$: Observable<any>;
  customForms$: Observable<any>;
  generalPrescriptionOrderType$: any;
  prescriptionArrangementFields$: Observable<any>;
  specificDrugConceptUuid$: Observable<unknown>;
  errors: any[] = [];
  allForms$: Observable<any>;
  loadingData: boolean = false;
  constructor(
    private visitsService: VisitsService,
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.loadingData = true
    // if(this.location){
    //   this.customForms$ = this.store.select(
    //     getCustomOpenMRSFormsByIds(this.location?.forms || [])
    //   );
    // } else {
    //   this.customForms$ = this.store.select(getAllForms);
    // }
    this.customForms$ = this.store.select(getAllForms);
    this.generalPrescriptionOrderType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.orderType"
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
    this.visits$ = this.visitsService
      .getAllPatientVisits(this.patient?.uuid, true)
      .pipe(
        map((response) => {
          this.loadingData = false;
          if (!response?.error) {
            return response?.map((visit) => {
              let obs = [];
              visit?.visit?.encounters.forEach((encounter) => {
                (encounter?.obs || []).forEach((observation) => {
                  obs = [
                    ...obs,
                    {
                      ...observation,
                      encounterType: {
                        uuid: encounter?.encounterType?.uuid,
                        display: encounter?.encounterType?.display,
                      },
                      provider: encounter?.encounterProviders[0]?.provider,
                    },
                  ];
                });
              });
              return {
                visit: visit?.visit,
                obs: obs,
                orders: [
                  ...visit?.visit?.encounters.map((encounter) => {
                    return (encounter?.orders || []).map((order) => {
                      return {
                        ...order,
                        encounterType: {
                          uuid: encounter?.encounterType?.uuid,
                          display: encounter?.encounterType?.display,
                        },
                      };
                    });
                  }),
                ].filter((order) => order.length),
              };
            });
          }
        })
      );
  }
}
