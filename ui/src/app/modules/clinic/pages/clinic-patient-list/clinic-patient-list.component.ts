import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { PatientHistoryDialogComponent } from "src/app/shared/dialogs/patient-history-dialog/patient-history-dialog.component";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getSettingCurrentLocationStatus,
} from "src/app/store/selectors";
import { getCurrentUserPrivileges } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-clinic-patient-list",
  templateUrl: "./clinic-patient-list.component.html",
  styleUrls: ["./clinic-patient-list.component.scss"],
})
export class ClinicPatientListComponent implements OnInit {
  currentLocation$: Observable<any>;
  selectedTab = new FormControl(0);
  settingCurrentLocationStatus$: Observable<boolean>;
  consultationOrderType$: Observable<any>;
  consultationEncounterType$: Observable<any>;
  radiologyOrderType$: Observable<any>;
  drugOrderType$: Observable<any>;
  labTestOrderType$: Observable<any>;
  showAllPatientsTab$: Observable<any>;
  userPrivileges$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation));
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );

    this.consultationOrderType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.consultation.orderType"
      );
    this.consultationEncounterType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.consultation.encounterType"
      );
    this.radiologyOrderType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.radiology.radiologyOrderType"
      );
    this.drugOrderType$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.clinic.drug.drugOrderType"
    );

    this.labTestOrderType$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.clinic.laboratory.labTestOrderType"
    );
    this.showAllPatientsTab$ =
      this.systemSettingsService.getSystemSettingsDetailsByKey(
        `iCare.clinic.settings.patientsListGroups.showAllPatientsTab`
      );
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
  }

  onSelectPatient(patient: any) {
    setTimeout(() => {
      this.store.dispatch(
        go({ path: [`/clinic/patient-dashboard/${patient?.patient?.uuid}`] })
      );
    }, 200);
  }

  changeTab(index) {
    this.selectedTab.setValue(index);
  }

  //modified onBack method
  onBack(e: Event) {
    e.stopPropagation
    const allPatientsTabIndex = 5; 
    this.selectedTab.setValue(allPatientsTabIndex);
    this.store.dispatch(go({ path: ["/"] }));
  }

  onOpenHistory(patient: any) {
    this.dialog.open(PatientHistoryDialogComponent, {
      width: "50%",
      data: {
        patient: patient,
      },
      disableClose: false,
    });
  }
}
