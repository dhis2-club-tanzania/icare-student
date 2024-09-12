import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { formatCurrentUserDetails } from "src/app/core/helpers/current-user.helper";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import { AuthService } from "../../core/services/auth.service";
import {
  addAuthenticatedUser,
  addSessionStatus,
  authenticateUser,
  authenticateUserFail,
  go,
  logoutUser,
  logoutUserFail,
  loadProviderDetails,
  setUserLocations,
  loadAllLocations,
  addLoadedUserDetails,
  loadRolesDetails,
  clearLocations,
  loadLocationByIds,
} from "../actions";
import { initiateEncounterType } from "../actions/encounter-type.actions";

@Injectable()
export class AuthEffects {
  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authenticateUser),
      switchMap(({ credentialsToken }) =>
        this.authService.login(credentialsToken).pipe(
          switchMap(
            ({
              authenticatedUser,
              authenticated,
              userUuid,
              loginResponse,
              user,
              userLocations,
            }) => {
              if (authenticated) {
                sessionStorage.setItem("JSESSIONID", loginResponse?.sessionId);
                localStorage.setItem("credentialsToken", credentialsToken);
                localStorage.setItem("userUuid", user.uuid);
              }
              return authenticated
                ? [
                    go({ path: [""] }),
                    setUserLocations({
                      userLocations: userLocations,
                    }),
                    loadProviderDetails({ userUuid }),
                    addLoadedUserDetails({
                      userDetails: formatCurrentUserDetails(authenticatedUser),
                    }),
                    addSessionStatus({ authenticated }),
                    loadLocationByIds({
                      locationUuids: JSON.parse(
                        localStorage
                          .getItem("userLocations")
                          .split(" ")
                          .join("")
                          .split("'")
                          .join('"')
                      ),
                      params: {
                        v: `custom:(display,uuid,tags:(uuid,display),parentLocation:(uuid,display),attributes,retired)`,
                      },
                      isUserLocations: true,
                    }),
                    initiateEncounterType(),
                  ]
                : [
                    authenticateUserFail({
                      error: {
                        status: 403,
                        message: "incorrect username or password",
                      },
                    }),
                  ];
            }
          ),
          catchError((error: any) => {
            // TODO: Add support to have a more readable error messages
            return of(authenticateUserFail({ error }));
          })
        )
      )
    )
  );

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logoutUser),
      switchMap(() => {
        this.notificationService.show(
          new Notification({ message: "Logging out", type: "LOADING" })
        );
        // document.cookie = `JSESSIONID= ;expires=${new Date()}`;
        //document.cookie = "JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        let credetialsToken = localStorage.getItem("credetialsToken");
        localStorage.removeItem("credentialsToken");
        localStorage.removeItem("currentLocation");
        localStorage.removeItem("navigationDetails");

        return this.authService.logout(credetialsToken).pipe(
          switchMap(() => {
            return [
              clearLocations(),
              addSessionStatus({ authenticated: false }),
              go({ path: ["/login"] }),
            ];
          }),
          catchError((error) => of(logoutUserFail({ error })))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
}
