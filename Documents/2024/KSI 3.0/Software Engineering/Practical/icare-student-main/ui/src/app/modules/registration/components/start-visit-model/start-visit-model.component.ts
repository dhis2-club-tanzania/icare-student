import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  go,
  loadCurrentPatient,
  loadLocationsByTagName,
  loadLocationsByTagNames,
} from "src/app/store/actions";
import {
  clearActiveVisit,
  clearVisits,
} from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getAllTreatmentLocations } from "src/app/store/selectors";
import {
  getActiveVisit,
  getVisitLoadedState,
} from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-start-visit-model",
  templateUrl: "./start-visit-model.component.html",
  styleUrls: ["./start-visit-model.component.scss"],
})
export class StartVisitModelComponent implements OnInit {
  treatmentLocations$: Observable<any[]>;
  loadingPatientByLocation: boolean = true;
  patient: any;
  patientPhone: any;
  selectedTab = new FormControl(0);
  omitCurrent: boolean = true;
  visitTypes$: Observable<any[]>;
  servicesConfigs$: Observable<any[]>;
  shouldNotLoadNonVisitItems: boolean = true;
  allowOnlineVerification$: Observable<boolean>;
  patientVisitsCount$: Observable<number>;
  currentVisitLoadedState$: Observable<boolean>;
  currentPatientVisit$: Observable<any>;

  startingVisit: boolean = false;
  errors: any[];

  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private dialogRef: MatDialogRef<StartVisitModelComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.patient = data?.patient;
    this.patient?.person?.attributes?.map((attribute) => {
      if (
        (attribute?.display?.split(" = ") || [])?.length > 0 &&
        (attribute?.display?.split(" = ")[0].toLowerCase() === "phone" ||
          attribute?.display?.split(" = ")[0].toLowerCase() === "mobilenumber")
      ) {
        this.patientPhone = attribute?.display?.split(" = ")[1];
      }
    });
    this.store.dispatch(
      loadLocationsByTagNames({
        tagNames: ["Treatment+Room", "Admission+Location"],
      })
    );
  }

  ngOnInit(): void {
    this.treatmentLocations$ = this.store.select(getAllTreatmentLocations);
    this.visitTypes$ = this.visitService.getVisitsTypes();
    this.servicesConfigs$ =
      this.systemSettingsService.getiCareServicesConfigurations();
    this.allowOnlineVerification$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.billing.insurance.nhif.allowOnlineVerification"
      );
    this.currentVisitLoadedState$ = this.store.select(getVisitLoadedState);
    this.currentPatientVisit$ = this.store.select(getActiveVisit);
  }

  onVisitUpdate(visitDetails: any): void {
    this.dialogRef.close(visitDetails);
  }

  onCancelVisitChanges(visitDetails: any): void {
    this.dialogRef.close({ visitDetails, close: true });
    this.store.dispatch(go({ path: ["/registration/home"] }));
  }

  onCloseDialog(close: boolean, currentPatientVisit: any): void {
    this.dialogRef.close({ visitDetails: currentPatientVisit, close });
    this.store.dispatch(clearActiveVisit());
  }

  changeTab(index): void {
    this.selectedTab.setValue(index);
  }

  onEditPatient(path) {
    this.dialogRef.close();
    setTimeout(() => {
      this.store.dispatch(go({ path: [path] }));
    }, 200);
  }

  onStartVisit() {
    this.startingVisit = true;
    this.store
      .select(getActiveVisit)
      .pipe(
        map((response: any) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      )
      .subscribe((response) => {
        if (response) {
          this.startingVisit = false;
          setTimeout(() => {
            this.dialogRef.close();
            this.store.dispatch(go({ path: ["/registration/home"] }));
          }, 200);
        }
      });
  }
}
