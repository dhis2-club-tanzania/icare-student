import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";
import { Action, select, Store } from "@ngrx/store";
import { orderBy } from "lodash";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { formatLocationsPayLoad } from "src/app/core";
import { LocationService } from "src/app/core/services";
import { AuthService } from "src/app/core/services/auth.service";
import { LocationSelectModalComponent } from "src/app/shared/components/location-select-modal/location-select-modal.component";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import {
  addLoadedLocations,
  loadAllLocations,
  loadingLocationsFails,
  loadLocationById,
  loadingLocationByTagNameFails,
  loadLocationsByTagName,
  loadLoginLocations,
  setCurrentUserCurrentLocation,
  upsertLocation,
  go,
  loadAllLocationsByLoginTag,
  loadLocationByIds,
  upsertLocations,
  updateCurrentLocationStatus,
  loadMainLocation,
  setAllUserAssignedLocationsLoadedState,
  loadLocationsByTagNames,
} from "../actions";
import { AppState } from "../reducers";
import {
  getCurrentLocation,
  getLocationEntities,
  getLocations,
  getUrl,
} from "../selectors";
import { getAuthenticationState } from "../selectors/current-user.selectors";

@Injectable()
export class LocationsEffects {
  routerReady$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(getCurrentLocation(false))),
              this.store.pipe(select(getUrl))
            )
          )
        ),
        tap(([{}, currentLocation, currentUrl]) => {
          if (!currentLocation && !(currentUrl || "").includes("login")) {
            const currentLocationFromLocalStorage =
              localStorage.getItem("currentLocation");

            if (!currentLocationFromLocalStorage) {
              this.dialog.open(LocationSelectModalComponent, {
                width: "20%",
                disableClose: true,
                panelClass: "custom-dialog-container",
              });
            } else {
              this.store.dispatch(
                setCurrentUserCurrentLocation({
                  location: JSON.parse(currentLocationFromLocalStorage),
                })
              );
            }
          }
        })
      ),
    { dispatch: false }
  );

  minLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMainLocation),
      switchMap(() => {
        return this.locationService.getMainLocation().pipe(
          map((locationsResults) => {
            return addLoadedLocations({
              locations: formatLocationsPayLoad(
                locationsResults?.results || []
              ),
            });
          }),
          catchError((error) => of(loadingLocationsFails({ error })))
        );
      })
    )
  );

  locations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLoginLocations),
      switchMap(() => {
        return this.locationService.getLoginLocations().pipe(
          map((locationsResults) => {
            return addLoadedLocations({
              locations: formatLocationsPayLoad(
                locationsResults?.results || []
              ),
            });
          }),
          catchError((error) => of(loadingLocationsFails({ error })))
        );
      })
    )
  );

  setCurrentLocation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setCurrentUserCurrentLocation),
        tap(({ location }) => {
          localStorage.setItem("currentLocation", JSON.stringify(location));
          // this.store.dispatch(go({ path: [''] }));
        })
      ),
    { dispatch: false }
  );

  loadLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocationById),

      withLatestFrom(this.store.select(getLocationEntities)),
      switchMap(([action, entities]: [any, any]) => {
        return this.locationService.getLocationById(action.locationUuid).pipe(
          switchMap((locationResponse) => {
            if (
              locationResponse &&
              (formatLocationsPayLoad([locationResponse] || []) || [])?.length >
                0
            ) {
              const location = {
                ...locationResponse,
                ...(formatLocationsPayLoad([locationResponse] || []) || [])[0],
              };
              if (action?.isCurrentLocation) {
                return [
                  setCurrentUserCurrentLocation({
                    location,
                  }),
                  entities[locationResponse?.uuid]
                    ? upsertLocation({
                        location: {
                          ...locationResponse,
                          ...(formatLocationsPayLoad(
                            [locationResponse] || []
                          ) || [])[0],
                        },
                      })
                    : addLoadedLocations({
                        locations: [
                          {
                            ...locationResponse,
                            ...(formatLocationsPayLoad(
                              [locationResponse] || []
                            ) || [])[0],
                          },
                        ],
                      }),
                  updateCurrentLocationStatus({ settingLocation: false }),
                ];
              } else {
                return [
                  upsertLocation({
                    location: {
                      ...locationResponse,
                      ...(formatLocationsPayLoad([locationResponse] || []) ||
                        [])[0],
                    },
                  }),
                ];
              }
            }
          })
        );
      })
    )
  );

  loadLocationsByIds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocationByIds),
      withLatestFrom(this.store.select(getLocationEntities)),
      switchMap(([action, locationsEntities]: [any, any]) => {
        const locationsToLoad = action.locationUuids?.filter(
          (uuid) => !locationsEntities[uuid]
        );
        return this.locationService
          .getLocationByIds(locationsToLoad, action?.params)
          .pipe(
            switchMap((locationsResponse) => {
              const formattedLocs = orderBy(
                formatLocationsPayLoad(locationsResponse || [])?.filter(
                  (location) => location || []
                ),
                ["display"],
                ["asc"]
              );
              let currentUserCurrentLocation;
              const storedCurrentLocation =
                localStorage.getItem("currentLocation");
              if (
                !storedCurrentLocation ||
                storedCurrentLocation === "null" ||
                !JSON.parse(storedCurrentLocation)?.uuid
              ) {
                currentUserCurrentLocation = formattedLocs[0];
              } else {
                currentUserCurrentLocation = JSON.parse(storedCurrentLocation);
              }
              return [
                addLoadedLocations({
                  locations: formattedLocs || [],
                }),
                setCurrentUserCurrentLocation({
                  location: currentUserCurrentLocation,
                }),
                action?.isUserLocations
                  ? setAllUserAssignedLocationsLoadedState({
                      allLoadedState:
                        locationsToLoad?.length === formattedLocs?.length,
                    })
                  : null,
                updateCurrentLocationStatus({ settingLocation: false }),
              ];
            })
          );
      })
    )
  );

  loadAllLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllLocations),
      withLatestFrom(this.store.select(getAuthenticationState)),
      switchMap(([action, isAuthenticated]: [any, boolean]) => {
        if (isAuthenticated) {
          return this.locationService.getAllLocations().pipe(
            map((locationResponse) => {
              const results = locationResponse?.results || [];
              return addLoadedLocations({
                locations: formatLocationsPayLoad(results),
              });
            })
          );
        } else {
          this.store.dispatch(go({ path: ["/login"] }));
          return of(null);
        }
      })
    )
  );

  locationByTagName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocationsByTagName),
      switchMap((action) => {
        return this.locationService
          .getLocationsByTagName(action.tagName, {
            limit: 100,
            startIndex: 0,
            v: "custom:(uuid,name,display,description,parentLocation:(uuid,name),tags,attributes,childLocations,retired)",
          })
          .pipe(
            switchMap((locationsResponse: any) => {
              // console.log("locationsResponse", locationsResponse);
              return [
                addLoadedLocations({
                  locations: formatLocationsPayLoad(locationsResponse || []),
                }),
                upsertLocations({
                  locations: formatLocationsPayLoad(locationsResponse || []),
                }),
                updateCurrentLocationStatus({ settingLocation: false }),
              ];
            }),
            catchError((error) => {
              return of(loadingLocationByTagNameFails({ error }));
            })
          );
      })
    )
  );

  locationByTagNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocationsByTagNames),
      switchMap((action) => {
        return this.locationService
          .getLocationsByTagNames(action.tagNames, {
            limit: 100,
            startIndex: 0,
            v: "custom:(uuid,name,display,description,parentLocation:(uuid,name),tags,attributes,childLocations,retired)",
          })
          .pipe(
            switchMap((locationsResponse: any) => {
              return [
                addLoadedLocations({
                  locations: formatLocationsPayLoad(locationsResponse || []),
                }),
                upsertLocations({
                  locations: formatLocationsPayLoad(locationsResponse || []),
                }),
                updateCurrentLocationStatus({ settingLocation: false }),
              ];
            }),
            catchError((error) => {
              return of(loadingLocationByTagNameFails({ error }));
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private locationService: LocationService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}
}
