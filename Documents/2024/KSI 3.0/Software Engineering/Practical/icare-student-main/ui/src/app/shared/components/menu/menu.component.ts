import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { Location } from "src/app/core/models";
import {
  addLoadedUserDetails,
  addSessionStatus,
  authenticateUser,
  go,
  loadAllLocations,
  loadLocationByIds,
  loadLocationsByTagName,
  loadLoginLocations,
  loadProviderDetails,
  loadRolesDetails,
  logoutUser,
  setUserLocations,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getChildLocationsOfTheFirstLevelParentLocation,
  getCurrentLocation,
  getUserAssignedLocationsLoadedState,
  loadingLocationsByIdState,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getUserAssignedLocations,
} from "src/app/store/selectors/current-user.selectors";
import { UserGet } from "src/app/shared/resources/openmrs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LocationSelectModalComponent } from "src/app/shared/components/location-select-modal/location-select-modal.component";
import { showSearchPatientOnMenu } from "src/app/store/selectors/ui.selectors";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { AuthService } from "src/app/core/services/auth.service";
import { formatCurrentUserDetails } from "src/app/core/helpers";
import { initiateEncounterType } from "src/app/store/actions/encounter-type.actions";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { catchError, map } from "rxjs/operators";
import { ManageUserProfileModalComponent } from "../../dialogs/manage-user-profile-modal/manage-user-profile-modal.component";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  matDialogRef: MatDialogRef<ChangePasswordComponent>;
  name: string = "";
  currentUser$: Observable<UserGet>;
  locationsForCurrentUser$: Observable<Location[]>;
  currentLocation$: Observable<Location>;
  showPatientSearch$: Observable<boolean>;
  lisConfigurations$: Observable<any>;

  isSupportOpened: boolean = false;
  modulesLocations$: Observable<boolean>;

  userLocationsUuids: string[];
  userAssignedLocationsLoadedState$: Observable<boolean>;
  googleFormLink$: Observable<string>;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private authService: AuthService,
    private systemSettingsService: SystemSettingsService,
    private httpClient: OpenmrsHttpClientService
  ) {
    this.store.dispatch(loadLoginLocations()); // This is also a main location
  }

  ngOnInit(): void {
    this.googleFormLink$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.general.systemSettings.support.googleFormLink"
    );
    this.lisConfigurations$ = this.store.select(getLISConfigurations);

    this.authService.getSession().subscribe((sessionResponse) => {
      this.store.dispatch(
        setUserLocations({
          userLocations: sessionResponse?.user?.userProperties?.locations,
        })
      );
      this.store.dispatch(
        loadProviderDetails({ userUuid: sessionResponse?.user?.uuid })
      );
      this.store.dispatch(loadRolesDetails());
      this.store.dispatch(
        addSessionStatus({ authenticated: sessionResponse?.authenticated })
      );
      this.userLocationsUuids = JSON.parse(
        localStorage
          .getItem("userLocations")
          .split("'")
          .join('"')
          .split(" ")
          .join("")
      );
      this.store.dispatch(
        loadLocationByIds({
          locationUuids: this.userLocationsUuids,
          params: {
            v: `custom:(display,uuid,tags:(uuid,display),parentLocation:(uuid,display),attributes,retired)`,
          },
          isUserLocations: true,
        })
      );

      this.store.dispatch(initiateEncounterType());
    });

    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.locationsForCurrentUser$ = this.store.select(getUserAssignedLocations);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation));
    this.showPatientSearch$ = this.store.pipe(select(showSearchPatientOnMenu));
    this.userAssignedLocationsLoadedState$ = this.store.select(
      getUserAssignedLocationsLoadedState
    );

    // this.authService.getSession().subscribe((sessionResponse) => {
    //   console.log("the sess response");
    //   console.log(sessionResponse);
    // });
    setInterval(() => {
      this.pingSession();
    }, 100000);
  }

  onRouteHome(e: Event): void {
    e.stopPropagation();
    this.router.navigate([""]);
  }

  onLogOut(): void {
    localStorage.clear();
    window.localStorage.clear();
    sessionStorage.clear();
    this.store.dispatch(logoutUser());
  }

  onOpenLocation(e: Event): void {
    if (e) {
      e.stopPropagation();
    }
    this.dialog.open(LocationSelectModalComponent, {
      width: "20%",
      disableClose: true,
      panelClass: "custom-dialog-container",
    });
  }
  onChangePassword(event: Event): void {
    // event.stopPropagation();
    this.matDialogRef = this.dialog.open(ChangePasswordComponent, {
      width: "25%",
      disableClose: true,
    });
  }

  onOpenSupportPage(event: Event): void {
    // event.stopPropagation();
    this.isSupportOpened = true;
  }

  onSupportClose(isOpened): void {
    this.isSupportOpened = isOpened;
  }

  pingSession(): void {
    this.httpClient
      .get(`location?tag=Login+Location`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      )
      .subscribe((response) => {
        if (response && !response?.error) {
          console.warn(response);
        } else if (response && response?.error) {
          this.store.dispatch(go({ path: ["login"] }));
        }
      });
  }

  onUpdateProfile(): void {
    // TODO: Add support to capture multiple systems credentials ("pimaCovid" can be used as system reference key to support that)
    const requests = [
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.externalSystems.integrated.pimaCovid.usernamePropertyKey`
      ),
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.externalSystems.integrated.pimaCovid.passwordPropertyKey`
      ),
    ];
    zip(...requests.map((request) => request)).subscribe((responses) => {
      if (responses[0] && responses[1]) {
        this.dialog.open(ManageUserProfileModalComponent, {
          width: "40%",
          data: {
            usernamePropertyKey: responses[0],
            passwordPropertyKey: responses[1],
          },
        });
      }
    });
  }
}
