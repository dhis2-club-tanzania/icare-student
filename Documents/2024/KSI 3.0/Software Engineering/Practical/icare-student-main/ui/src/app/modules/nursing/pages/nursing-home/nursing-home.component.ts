import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { PatientListDialogComponent } from "src/app/shared/dialogs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import {
  addCurrentPatient,
  authenticateUser,
  go,
  loadRolesDetails,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getSettingCurrentLocationStatus } from "src/app/store/selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-nursing-home",
  templateUrl: "./nursing-home.component.html",
  styleUrls: ["./nursing-home.component.scss"],
})
export class NursingHomeComponent implements OnInit {
  loadingVisit$: Observable<boolean>;
  isPatientListTabular: boolean;
  settingCurrentLocationStatus$: Observable<boolean>;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(loadRolesDetails());
  }

  ngOnInit(): void {
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );
    this.isPatientListTabular = this.route.snapshot.queryParams["tabular"]
      ? true
      : this.route.snapshot.queryParams["account_box"]
      ? false
      : true;
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
  }

  onSearchPatient(e: Event) {
    const patientListDialog = this.dialog.open(PatientListDialogComponent, {
      width: "800px",
    });

    patientListDialog
      .afterClosed()
      .subscribe((response: { action: string; patient: Patient }) => {
        if (response?.action === "PATIENT_SELECT") {
          this.store.dispatch(addCurrentPatient({ patient: response.patient }));
        }
      });
  }

  onSelectPatient(patient: any, e?: Event): void {
    if (e) {
      e.stopPropagation();
    }
    this.store.dispatch(addCurrentPatient({ patient }));
    this.store.dispatch(
      go({
        path: ["/nursing/consult"],
        query: { queryParams: { patient: patient?.patient?.uuid } },
      })
    );
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ["/"] }));
  }
}
