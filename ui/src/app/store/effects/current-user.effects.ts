import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { from } from "rxjs";
import { tap, withLatestFrom, map, switchMap, mergeMap } from "rxjs/operators";
import {
  CurrentUserDetailsService,
  formatCurrentUserDetails,
} from "src/app/core";
import { AuthService } from "src/app/core/services/auth.service";
import { Api } from "../../shared/resources/openmrs";
import {
  addLoadedUserDetails,
  initiateCurrentUserLoad,
  loadCurrentUserDetails,
  loadProviderDetails,
  addLoadedProviderDetails,
  setUserLocations,
  loadSessionDetails,
  addLoadedCurrentUser,
  loadRolesDetails,
  addLoadedRolesDetails,
  setCurrentUserCurrentLocation,
} from "../actions";
import { AppState } from "../reducers";
import { getCurrentUserDetails } from "../selectors/current-user.selectors";

@Injectable()
export class CurrentUserEffects implements OnInitEffects {
  initiateCurrentUserLoad$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initiateCurrentUserLoad),
        tap(() => {
          const uuid = localStorage.getItem("userUuid");
          if (this.authService.isAuthenticated() && uuid) {
            this.store.dispatch(loadCurrentUserDetails({ uuid }));
            this.store.dispatch(loadProviderDetails({ userUuid: uuid }));
            this.store.dispatch(
              setCurrentUserCurrentLocation({
                location: localStorage.getItem("currentLocation")
                  ? JSON.parse(localStorage.getItem("currentLocation"))
                  : null,
              })
            );
          }
        })
      ),

    { dispatch: false }
  );

  roles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRolesDetails),
      switchMap(() => {
        return this.currentUserService.getRolesDetails().pipe(
          map((response) => {
            return addLoadedRolesDetails({ roles: response });
          })
        );
      })
    )
  );

  userDetails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCurrentUserDetails),
        withLatestFrom(this.store.select(getCurrentUserDetails)),
        tap(([{ uuid }, user]: [any, any]) => {
          if (
            (!user ||
              (user &&
                user?.privileges &&
                Object.keys(user?.privileges)?.length == 0)) &&
            uuid !== ""
          ) {
            this.currentUserService.get(uuid).subscribe((userDetails) => {
              this.store.dispatch(
                addLoadedUserDetails({
                  userDetails: formatCurrentUserDetails(userDetails),
                })
              );
              this.store.dispatch(
                setUserLocations({
                  userLocations:
                    userDetails?.userProperties &&
                    userDetails?.userProperties?.locations
                      ? userDetails?.userProperties?.locations
                      : null,
                })
              );
            });
          }
        })
      ),
    { dispatch: false }
  );

  providerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProviderDetails),
      mergeMap((action) =>
        this.currentUserService.getProviderByUserDetails(action.userUuid).pipe(
          map((providerDetails) => {
            return addLoadedProviderDetails({ provider: providerDetails });
          })
        )
      )
    )
  );

  session$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSessionDetails),
      switchMap(() =>
        this.currentUserService.getSessionDetails().pipe(
          map((response) => {
            if (!response?.authenticated) {
              // Redirect to login
              // window.location.replace('../../../bahmni/home/index.html#/login');
            } else {
              const sessionData = {
                sessionId: response?.sessionId,
                authenticated: true,
                user: { uuid: response?.user?.uuid },
              };
              sessionStorage.setItem(
                "sessionInfo",
                JSON.stringify(sessionData)
              );
              localStorage.setItem("userUuid", response?.user?.uuid);
            }
            return addLoadedCurrentUser({ currentUser: response?.user });
          })
        )
      )
    )
  );

  ngrxOnInitEffects(): Action {
    return initiateCurrentUserLoad();
  }

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private api: Api,
    private currentUserService: CurrentUserDetailsService,
    private authService: AuthService
  ) {}
}
