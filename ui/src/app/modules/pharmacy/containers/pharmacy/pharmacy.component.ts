import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getCurrentUserInfo,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";

@Component({
  selector: "app-pharmacy",
  templateUrl: "./pharmacy.component.html",
  styleUrls: ["./pharmacy.component.scss"],
})
export class PharmacyComponent implements OnInit {
  iCareConnectConfigurations$: Observable<iCareConnectConfigurationsModel>;
  showMenuItems: boolean = true;
  errors: any[] = [];
  currentLocation$: Observable<any>;
  currentSubModule: string;
  currentUser$: Observable<any>;
  privileges$: Observable<any>;
  currentRoutePath: string;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private systemSettingsService: SystemSettingsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.iCareConnectConfigurations$ = this.store.select(getLISConfigurations);
    this.currentLocation$ = this.store.select(getCurrentLocation());
  }

  ngOnInit(): void {
    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.currentUser$ = this.store.select(getCurrentUserInfo);
    const navigationDetails = JSON.parse(
      localStorage.getItem("navigationDetails")
    );
    this.currentRoutePath =
      navigationDetails && navigationDetails?.path[0]
        ? navigationDetails?.path[0]?.replace("/pharmacy/", "")
        : "";
    this.store.dispatch(
      go({
        path: ["/pharmacy/" + this.currentRoutePath],
      })
    );
  }

  toggleMenuItems(event: Event): void {
    event.stopPropagation();
    this.showMenuItems = !this.showMenuItems;
  }

  changeRoute(event: Event, routePath: string) {
    const capitalizedRoutePath = routePath.charAt(0).toUpperCase() + routePath.slice(1);
    this.trackActionForAnalytics(`${capitalizedRoutePath}: Open`);

    if (event) {
   
      event.stopPropagation();
    }
    this.currentRoutePath = routePath;
    this.store.dispatch(
      go({
        path: ["/pharmacy/" + this.currentRoutePath],
      })
    );
  }
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

}
