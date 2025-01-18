import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import {
  authenticateUser,
  loadCurrentPatient,
  loadRolesDetails,
} from "src/app/store/actions";
import { loadPatientBills } from "src/app/store/actions/bill.actions";
import { loadFormPrivilegesConfigs } from "src/app/store/actions/form-privileges-configs.actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getAllUSerRoles,
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
import {
  getFormPrivilegesConfigs,
  getFormPrivilegesConfigsLoadingState,
} from "src/app/store/selectors/form-privileges-configs.selectors";

@Component({
  selector: "app-nursing-data-home",
  templateUrl: "./nursing-data-home.component.html",
  styleUrls: ["./nursing-data-home.component.scss"],
})
export class NursingDataHomeComponent implements OnInit {
  privilegesConfigs$: Observable<any>;
  formPrivilegesConfigsLoadingState$: Observable<boolean>;
  currentUser$: Observable<any>;
  allUserRoles$: Observable<any[]>;
  userPrivileges$: Observable<any>;
  nursingConfigurations$: Observable<any>;
  currentLocation$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private systemSettingsService: SystemSettingsService
  ) {
    this.store.dispatch(loadFormPrivilegesConfigs());
    this.store.dispatch(loadRolesDetails());
  }

  ngOnInit(): void {
    this.nursingConfigurations$ =
      this.systemSettingsService.getSystemSettingsDetailsByKey(
        "icare.nursing.configurations"
      );
    const patientId = this.route.snapshot.queryParams["patient"];
    this.store.dispatch(
      loadPatientBills({
        patientUuid: patientId,
        isRegistrationPage: true,
      })
    );
    this.store.dispatch(loadActiveVisit({ patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.store.dispatch(loadPatientBills({ patientUuid: patientId }));
    this.allUserRoles$ = this.store.select(getAllUSerRoles);
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
    this.privilegesConfigs$ = this.store.select(getFormPrivilegesConfigs);
    this.formPrivilegesConfigsLoadingState$ = this.store.select(
      getFormPrivilegesConfigsLoadingState
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.currentLocation$ = this.store.select(getCurrentLocation);
  }
}
