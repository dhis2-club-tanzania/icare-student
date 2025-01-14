import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ProviderGetFull } from "src/app/shared/resources/openmrs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { loadCurrentPatient } from "src/app/store/actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
import {
  getActiveVisit,
  getVisitLoadingState,
} from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-theatre-dashboard",
  templateUrl: "./theatre-dashboard.component.html",
  styleUrls: ["./theatre-dashboard.component.scss"],
})
export class TheatreDashboardComponent implements OnInit {
  provider$: Observable<ProviderGetFull>;
  activeVisit$: Observable<Visit>;
  currentLocation$: Observable<Location>;
  patient$: Observable<Patient>;
  currentUser$: Observable<any>;
  userPrivileges$: Observable<any>;
  iCareGeneralConfigurations$: Observable<any>;
  loadingVisit$: Observable<any>;
  constructor(
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.params["patient"];
    this.store.dispatch(loadActiveVisit({ patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.iCareGeneralConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.GeneralMetadata.Configurations"
      );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.activeVisit$ = this.store.pipe(select(getActiveVisit));
    this.currentLocation$ = this.store.select(getCurrentLocation(false));
  }
}
