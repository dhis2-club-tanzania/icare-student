import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { AppState } from "src/app/store/reducers";
import {
  getAllUSerRoles,
  getCurrentUserInfo,
  getCurrentUserPrivileges,
  getUserAssignedLocations,
} from "src/app/store/selectors/current-user.selectors";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import {
  loadLabConfigurations,
  setVisitsParameters,
  clearLoadedLabSamples,
  loadSampleTypes,
  clearLoadedLabOrders,
  loadRolesDetails,
  loadOrderTypes,
  go,
  clearVisitsDatesParameters,
  setCurrentUserCurrentLocation,
  loadSystemSettings,
} from "src/app/store/actions";
import { loadSpecimenSources } from "./store/actions/specimen-sources-and-tests-management.actions";
import {
  getAllSampleTypes,
  getCurrentLocation,
  getLoadedSystemSettingsState,
} from "src/app/store/selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";
import { Title } from "@angular/platform-browser";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";

@Component({
  selector: "lab-root",
  templateUrl: "./laboratory.component.html",
  styleUrls: ["./laboratory.component.scss"],
})
export class LaboratoryComponent implements OnInit {
  title = "Laboratory";
  billingInformation$: Observable<any>;
  results$: Observable<any>;
  labOrders$: Observable<any>;
  entities$: Observable<any>;
  currentUserUuid: string;
  currentUser$: Observable<any>;
  parameters: any = {};
  privileges$: Observable<any>;
  roles$: Observable<any>;
  currentUserLoadedState$: Observable<boolean>;
  selectedDay: Date = new Date();
  today: Date = new Date();
  url$: Observable<any>;
  showDate: boolean = false;
  startDate: any;
  endDate: any;
  datesRangeDifference: number = 2;
  currentSubModule: string;

  sampleTypes$: Observable<any>;
  specimenSources$: Observable<any>;
  userRoles$: Observable<any>;
  currentRoutePath: string = "";
  showMenuItems: boolean = true;
  /**
   *
   * @param store
   * @param router
   * @param route
   * Important keys
   * 1. iCare.LIS: The value is this is true or false
   * 2. iCare.Laboratory.agencyConceptUuid
   */

  LISConfigurations$: Observable<iCareConnectConfigurationsModel>;
  currentLocation$: Observable<any>;
  labs$: Observable<any[]>;
  errors: any[] = [];
  loadedSystemSettings$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private locationService: LocationService,
    private systemSettingsService: SystemSettingsService
  ) {
    this.store.dispatch(loadRolesDetails());
    this.store.dispatch(loadOrderTypes());
    // this.store.dispatch(loadLISConfigurations());
    this.labs$ = this.store.select(getUserAssignedLocations);

    this.LISConfigurations$ = this.store.select(getLISConfigurations);
    router.events.pipe(take(1)).subscribe((currentRoute) => {
      // console.log('this :: ', currentRoute instanceof NavigationEnd);
      if (currentRoute instanceof NavigationEnd) {
        // console.log(currentRoute);

        if (currentRoute?.url?.includes("/sample-acceptance-and-results")) {
          this.enableDate(this.datesRangeDifference, this.showDate);
          this.currentSubModule = "acceptance";
          this.store.dispatch(
            go({
              path: ["/laboratory/sample-acceptance-and-results"],
            })
          );
        } else if (currentRoute?.url?.includes("/dashboard")) {
          this.enableDate(this.datesRangeDifference, this.showDate);
          this.currentSubModule = "dashboard";
          this.store.dispatch(
            go({
              path: ["/laboratory/dashboard-lab"],
            })
          );
        } else if (currentRoute?.url?.includes("/sample-tracking")) {
          this.enableDate(this.datesRangeDifference, this.showDate);
          this.currentSubModule = "tracking";
          this.store.dispatch(
            go({
              path: ["/laboratory/sample-tracking"],
            })
          );
        } else if (currentRoute?.url?.includes("/lab-investigation-home")) {
          this.disableDate();
          this.currentSubModule = "order-tests";
          this.store.dispatch(
            go({
              path: ["/laboratory/lab-investigation-home"],
            })
          );
        } else if (currentRoute?.url?.includes("/reports")) {
          this.disableDate();
          this.currentSubModule = "reports";
          this.store.dispatch(
            go({
              path: ["/laboratory/reports"],
            })
          );
        } else if (currentRoute?.url?.includes("/settings")) {
          this.disableDate();
          this.currentSubModule = "settings";
          this.store.dispatch(
            go({
              path: ["/laboratory/settings"],
            })
          );
        } else if (currentRoute?.url?.includes("/sample-collection-home")) {
          this.currentSubModule = "collection";
          this.disableDate();
          this.store.dispatch(
            go({
              path: ["/laboratory/sample-collection-home"],
            })
          );
        } else if (currentRoute?.url === "/laboratory/sample-results-list") {
          this.router.navigate(["laboratory"]);
          this.store.dispatch(
            go({
              path: ["/laboratory/sample-results-list"],
            })
          );
        } else if (currentRoute?.url === "/laboratory") {
          this.router.navigate(["laboratory"]);
          this.store.dispatch(
            go({
              path: ["/laboratory"],
            })
          );
        }
      }
    });
  }

  ngOnInit() {
    this.systemSettingsService
      .getSystemSettingsByKey(`icare.general.selectedSystemSettings`)
      .subscribe((response) => {
        if (response && response !== "none" && !response?.error) {
          this.store.dispatch(
            loadSystemSettings({ settingsKeyReferences: response })
          );
          this.loadedSystemSettings$ = this.store.select(
            getLoadedSystemSettingsState
          );
        } else {
          this.errors = [
            ...this.errors,
            {
              error: {
                error:
                  "There is missing configuration for icare.general.selectedSystemSettings, contact IT",
                message:
                  "There is missing configuration for icare.general.selectedSystemSettings, contact IT",
              },
            },
          ];
        }
      });
    this.LISConfigurations$.subscribe((response) => {
      if (response && response?.isLIS) {
        this.titleService.setTitle("NPHL IS");
      }
    });
    // evaluate condition for showing date
    const currentPath = JSON.parse(localStorage.getItem("navigationDetails"))
      ?.path[0];
    if (
      currentPath?.indexOf("sample-collection") == -1 &&
      currentPath?.indexOf("settings") == -1 &&
      currentPath?.indexOf("reports") == -1 &&
      currentPath?.indexOf("sample-registration") == -1
    ) {
      this.showDate = true;
    } else {
      this.showDate = false;
    }

    this.url$ = this.route.url.pipe(map((segments) => segments.join("")));
    this.userRoles$ = this.store.select(getAllUSerRoles);
    // this.store.dispatch(loadSessionDetails());
    this.store.dispatch(loadSpecimenSources());

    let today = formatDateToYYMMDD(new Date());

    this.parameters = {
      ...this.parameters,
      startDate: formatDateToYYMMDD(
        new Date(
          Number(today.split("-")[0]),
          Number(today.split("-")[1]) - 1,
          Number(today.split("-")[2]) - this.datesRangeDifference
        )
      ),
      endDate: formatDateToYYMMDD(
        new Date(
          Number(today.split("-")[0]),
          Number(today.split("-")[1]) - 1,
          Number(today.split("-")[2])
        )
      ),
    };

    this.startDate = this.parameters?.startDate;
    this.endDate = this.parameters?.endDate;

    this.store.dispatch(
      loadLabConfigurations({ periodParameters: this.parameters })
    );

    this.store.dispatch(setVisitsParameters({ parameters: this.parameters }));
    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    this.currentUser$ = this.store.select(getCurrentUserInfo);

    // Set current location if not set
    // if (!JSON.parse(localStorage.getItem("currentLocation"))) {
    //   this.currentUser$.subscribe((response) => {
    //     if (response) {
    //       console.log(response);
    //     }
    //   });
    // }
    this.store.dispatch(loadSampleTypes());

    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    const navigationDetails = JSON.parse(
      localStorage.getItem("navigationDetails")
    );
    this.currentRoutePath =
      navigationDetails && navigationDetails?.path[0]
        ? navigationDetails?.path[0]?.replace("/laboratory/", "")
        : "";
    this.currentLocation$ = this.store.select(getCurrentLocation(false));
  }

  setCurrentLab(location: any): void {
    this.currentLocation$ = of(null);
    if (location) {
      localStorage.setItem("currentLocation", JSON.stringify(location));

      setTimeout(() => {
        this.currentLocation$ = this.store.select(getCurrentLocation(true));
      }, 100);
    } else {
      localStorage.setItem(
        "currentLocation",
        JSON.stringify({ name: "All", display: "All" })
      );

      setTimeout(() => {
        this.currentLocation$ = this.store.select(getCurrentLocation(true));

        if (this.currentRoutePath === "sample-registration") {
          this.changeRoute(null, "sample-acceptance-and-results", true);
        }
      }, 100);
    }
  }

  toggleMenuItems(event: Event): void {
    event.stopPropagation();
    this.showMenuItems = !this.showMenuItems;
  }

  disableDate() {
    this.showDate = false;
  }

  changeRoute(
    event: Event,
    routePath: string,
    showDate: boolean,
    dateRange?: number
  ) {
    if (event) {
      event.stopPropagation();
    }
    const currentLoc = localStorage.getItem("currentLocation");
    if (currentLoc && currentLoc.indexOf("{") > -1) {
    } else {
      try {
        const locationUuid = JSON.parse(localStorage.getItem("userLocations"));
        this.locationService
          .getLocationById(locationUuid)
          .subscribe((response: any) => {
            if (response) {
              this.store.dispatch(
                setCurrentUserCurrentLocation({ location: response })
              );
              this.store.dispatch(
                loadLabConfigurations({ periodParameters: this.parameters })
              );
            }
          });
      } catch (e) {}
    }
    this.currentRoutePath = routePath;
    this.showDate = showDate;
    if (this.showDate) {
      this.enableDate(this.datesRangeDifference, showDate);
    }
    this.store.dispatch(
      go({
        path: [
          (routePath !== "tests-control" ? "/laboratory/" : "/") + routePath,
        ],
      })
    );
  }

  enableDate(dateRange: any, showDate: boolean): void {
    this.showDate = showDate;
    let endDate =
      dateRange == 6
        ? formatDateToYYMMDD(new Date())
        : this.parameters?.endDate;

    this.parameters = {
      ...this.parameters,
      startDate: formatDateToYYMMDD(
        new Date(
          Number(endDate?.split("-")[0]),
          Number(endDate?.split("-")[1]) - 1,
          Number(endDate?.split("-")[2]) - dateRange
        )
      ),
      endDate: formatDateToYYMMDD(
        new Date(
          Number(endDate?.split("-")[0]),
          Number(endDate?.split("-")[1]) - 1,
          Number(endDate?.split("-")[2])
        )
      ),
    };

    this.startDate = this.parameters?.startDate;
    this.endDate = this.parameters?.endDate;

    this.store.dispatch(setVisitsParameters({ parameters: this.parameters }));
  }

  onDateChange(reload?: boolean) {
    if (reload && this.endDate) {
      this.store.dispatch(clearLoadedLabOrders());

      this.store.dispatch(clearLoadedLabSamples());
      this.store.dispatch(clearVisitsDatesParameters());
      this.parameters = {
        ...this.parameters,
        startDate: `${this.startDate.getFullYear()}-${
          this.startDate.getMonth() + 1
        }-${this.startDate.getDate()}`,
        endDate: `${this.endDate.getFullYear()}-${
          this.endDate.getMonth() + 1
        }-${this.endDate.getDate()}`,
      };

      this.store.dispatch(
        loadLabConfigurations({ periodParameters: this.parameters })
      );

      setTimeout(() => {
        this.store.dispatch(
          setVisitsParameters({ parameters: this.parameters })
        );
      }, 200);

      // this.store.dispatch(loadActiveVisits({ parameters: this.parameters }));

      if (this.currentSubModule == "collection") {
        // console.log('here');
        // this.store.dispatch(
        //   loadActiveVisitsWithLabOrders({
        //     startDate: this.parameters?.startDate,
        //     endDate: this.parameters?.endDate,
        //   })
        // );
      } else {
        // console.log('not collection');
      }
      //this.refreshPage()
    }
  }
}
