import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ReportParamsService } from "src/app/core/services/report-params.service";
import { ReportService } from "src/app/core/services/report.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { loadRolesDetails } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
  getRolesLoadedState,
  getRolesLoadingState,
} from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-reports-home",
  templateUrl: "./reports-home.component.html",
  styleUrls: ["./reports-home.component.scss"],
})
export class ReportsHomeComponent implements OnInit {
  reportsAccessConfigurations$: Observable<any>;
  userPrivileges$: Observable<any>;

  reportsCategoriesConfigurations$: Observable<any>;
  reportsParametersConfigurations$: Observable<any>;
  reportsExtraParams$: Observable<any>;
  reportGroups$: Observable<any>;
  loadedAllRoles$: Observable<boolean>;
  standardReports$: Observable<any[]>;

  selectedReport: any;
  currentUser$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private reportsService: ReportService,
    private reportParamsService: ReportParamsService
  ) {
    this.store.dispatch(loadRolesDetails());
  }

  ngOnInit(): void {
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
    this.reportsAccessConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.Reports.Access.Configurations"
      );
    this.reportsCategoriesConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.Reports.Categories.Configurations"
      );

    this.reportsParametersConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.Reports.Parameters.Configurations"
      );

    this.reportsExtraParams$ = this.reportParamsService.getReportExtraParams();
    this.reportGroups$ = this.reportParamsService.getReportGroups();
    this.loadedAllRoles$ = this.store.select(getRolesLoadedState);

    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  // onGetSelectedReport(report: any): void {
  //   this.selectedReport = report;
  // }

  // getBackToReportsList(event: Event): void {
  //   event.stopPropagation();
  //   this.selectedReport = null;
  // }
}