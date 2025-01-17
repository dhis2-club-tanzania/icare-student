import { Component, Input, OnInit } from "@angular/core";
import { Location } from "src/app/core/models";

import { flatten, uniqBy, orderBy } from "lodash";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import {
  go,
  setCurrentUserCurrentLocation,
  updateCurrentLocationStatus,
} from "src/app/store/actions";
import { ICARE_APPS } from "src/app/core/containers/modules/modules.constants";

@Component({
  selector: "app-modules-selector",
  templateUrl: "./modules-selector.component.html",
  styleUrls: ["./modules-selector.component.scss"],
})
export class ModulesSelectorComponent implements OnInit {
  @Input() locations: Location[];
  @Input() lisConfigurations: any;
  modulesReferences: string[];
  currentModule: any;
  @Input() currentLocation: any;
  userLocationsForTheCurrentModule: Location[];
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const storedNavigationDetails =
      localStorage.getItem("navigationDetails") != "undefined"
        ? JSON.parse(localStorage.getItem("navigationDetails"))
        : null;
    let locationMatchingNavigationDetails =
      storedNavigationDetails?.path[0] !== ""
        ? (this.locations.filter(
            (location) =>
              (
                location?.modules.filter(
                  (module) =>
                    storedNavigationDetails?.path[0]?.indexOf(module?.id) > -1
                ) || []
              )?.length > 0
          ) || [])[0]
        : null;

    const storedLocation =
      localStorage.getItem("currentLocation") == "undefined" ||
      !localStorage.getItem("currentLocation")
        ? null
        : JSON.parse(localStorage.getItem("currentLocation"));
    if (storedNavigationDetails && locationMatchingNavigationDetails) {
      const isStoredLocationHasModuleMatchingStoredNavigationData =
        !storedLocation
          ? false
          : (
              storedLocation?.modules?.filter(
                (module) =>
                  storedNavigationDetails?.path[0]?.indexOf(module?.id) > -1
              ) || []
            )?.length > 0;
      this.currentLocation =
        storedLocation && isStoredLocationHasModuleMatchingStoredNavigationData
          ? storedLocation
          : locationMatchingNavigationDetails;

      // this.store.dispatch(
      //   setCurrentUserCurrentLocation({ location: this.currentLocation })
      // );
      const modules = (
        this.currentLocation?.attributes?.filter(
          (attribute) =>
            attribute?.attributeType?.display?.toLowerCase() === "modules" &&
            !attribute?.voided
        ) || []
      ).map((locationAttribute) => {
        return {
          id: locationAttribute?.value,
          app: (ICARE_APPS.filter(
            (app) => app?.id === locationAttribute?.value
          ) || [])[0],
          location: this.currentLocation,
        };
      });

      // Hinglight the current location
      // console.log("modules", modules);
      if (
        !this.currentLocation?.modules ||
        (this.currentLocation?.modules &&
          this.currentLocation?.modules?.length == 0)
      ) {
        this.currentLocation = (this.locations?.filter(
          (loc) => loc?.modules?.length > 0
        ) || [])[0];
        // this.store.dispatch(
        //   setCurrentUserCurrentLocation({ location: this.currentLocation })
        // );
      }
      this.currentModule = {
        ...this.currentLocation?.modules[0],
        ...(modules.filter(
          (module) => module?.id === this.currentLocation?.modules[0]?.id
        ) || [])[0],
      };

      this.modulesReferences = orderBy(
        uniqBy(
          flatten(
            this.locations.map((location) => {
              return location?.modules
                .map((module) => {
                  const matchedModules =
                    ICARE_APPS.filter((app) => app?.id === module?.id) || [];
                  return matchedModules && matchedModules?.length > 0
                    ? {
                        ...module,
                        app: matchedModules[0],
                        order: matchedModules[0]?.order,
                      }
                    : null;
                })
                ?.filter((module) => module);
            })
          ),
          "id"
        ),
        ["order"],
        ["asc"]
      );
    } else {
      this.modulesReferences = orderBy(
        uniqBy(
          flatten(
            this.locations.map((location) => {
              return location?.modules
                .map((module) => {
                  return {
                    ...module,
                    app: (orderBy(ICARE_APPS, ["order"], ["asc"]).filter(
                      (app) => app?.id === module?.id
                    ) || [])[0],
                  };
                })
                ?.filter((module) => module);
            })
          ),
          "id"
        ),
        ["order"],
        ["asc"]
      );
      this.currentModule = this.lisConfigurations?.isLIS
        ? (this.modulesReferences?.filter(
            (module: any) => module?.id === "laboratory"
          ) || [])[0]
        : this.modulesReferences[0];
      this.currentLocation = {
        ...this.modulesReferences[0]["location"],
        id: this.modulesReferences[0]["location"]?.uuid,
      };
    }

    this.modulesReferences = orderBy(
      this.modulesReferences.map((module: any) => {
        return {
          ...module,
          order: module?.app?.order,
        };
      }),
      ["order"],
      ["asc"]
    );

    this.userLocationsForTheCurrentModule =
      this.locations.filter(
        (location: any) =>
          (
            location?.modules.filter(
              (module) => module?.id === this.currentModule?.id
            ) || []
          ).length > 0 && !location?.retired
      ) || [];
    this.store.dispatch(
      setCurrentUserCurrentLocation({ location: this.currentLocation })
    );
    // Get the navigation details from localstorage
    const navigationDetails = JSON.parse(
      localStorage.getItem("navigationDetails")
    );
    const isNavigationDetailsAvailable =
      !navigationDetails ||
      (navigationDetails &&
        navigationDetails?.path &&
        !navigationDetails?.path[0])
        ? false
        : true;
    // console.log("navigationDetails", navigationDetails);
    this.store.dispatch(
      go({
        path: !isNavigationDetailsAvailable
          ? [
              this.currentModule?.app?.path +
                (this.currentModule?.app?.path === "/laboratory" &&
                this.lisConfigurations?.isLIS
                  ? "/dashboard-lab"
                  : "") +
                (this.currentModule?.app?.considerLocationRoute
                  ? "/" + this.currentLocation?.uuid
                  : ""),
            ]
          : [
              navigationDetails
                ? navigationDetails?.path[0]
                : this.currentModule?.id,
            ],
        query: { queryParams: navigationDetails["queryParams"] },
      })
    );
    this.locationStatusControl();
  }

  onSelectModuleLocation(event: Event, module: any): void {
    event.stopPropagation();
    this.currentModule = module;
    this.userLocationsForTheCurrentModule =
      this.locations.filter(
        (location: any) =>
          (
            location?.modules.filter(
              (module) => module?.id === this.currentModule?.id
            ) || []
          ).length > 0 && !location?.retired
      ) || [];
    this.currentLocation = this.userLocationsForTheCurrentModule[0];
    // localStorage.setItem("currentLocation", this.currentLocation);
    this.currentLocation = {
      ...module?.location,
      id: module?.location?.uuid,
      app: this.currentModule?.app,
    };
    this.store.dispatch(
      setCurrentUserCurrentLocation({ location: this.currentLocation })
    );
    const url =
      this.currentModule?.app?.path +
      (this.currentModule?.app?.considerLocationRoute
        ? "/" + this.currentLocation?.uuid
        : "");
    this.store.dispatch(
      go({
        path: [url],
      })
    );
    this.locationStatusControl();
  }

  onSetLocation(event: Event, location): void {
    event.stopPropagation();
    this.currentLocation = location;
    this.store.dispatch(
      setCurrentUserCurrentLocation({ location: this.currentLocation })
    );
    const path =
      this.currentModule?.app?.path +
      (this.currentModule?.app?.considerLocationRoute
        ? "/" + this.currentLocation?.uuid
        : "");
    this.store.dispatch(
      go({
        path: [path],
      })
    );
    this.locationStatusControl();
  }

  locationStatusControl(): void {
    this.store.dispatch(updateCurrentLocationStatus({ settingLocation: true }));
    setTimeout(() => {
      this.store.dispatch(
        updateCurrentLocationStatus({ settingLocation: false })
      );
    }, 200);
  }
}
