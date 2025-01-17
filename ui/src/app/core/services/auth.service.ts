import { Injectable } from "@angular/core";
import {
  from,
  Observable,
  of,
  ReplaySubject,
  Subject,
  throwError,
  TimeoutError,
  timer,
} from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { OpenmrsHttpClientService } from "../../shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";
import { formatCurrentUserDetails } from "../helpers";
import { CurrentUserDetailsService } from "..";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _session: Subject<any> = new ReplaySubject(1);
  cookieValue: any; // cookie value declaration
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private currentUserService: CurrentUserDetailsService,
    private cookieService : CookieService // imported and injected CookieService in the constructor
  ) {
    this.getSession().subscribe(
      (session) => {
        this._session.next(session);
      },
      () => {
        this._session.next(null);
      }
    );
  }

  isAuthenticated(): any {
    return this.getSession().pipe(
      map((session) => {
        localStorage.setItem(
          "userLocations",
          session?.user?.userProperties?.locations
        );
        return session?.authenticated;
      }),
      catchError(() => of(false))
    );
  }

  session(): Observable<any> {
    return this._session;
  }

  clearCookie() {
    var cookies = document.cookie.split("; ");
    console.log("cookies" , document.cookie); // consoling the available cookies in the browser
    this._cookieService.deleteAll() // deleting all the cookies
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
    }
  }

  login(credentialsToken: string): Observable<any> {
    localStorage.clear();
    window.localStorage.clear();
    sessionStorage.clear();

    this.clearCookie();
  this.cookieService.delete("JSESSIONID") //deleted the cookie present when new user tries to log in"

    return this.httpClient.login(credentialsToken).pipe(
      switchMap((loginResponse) => {
        const { authenticated, user } = loginResponse;
        this._session.next(loginResponse);
        return this.currentUserService.get(user?.uuid).pipe(
          map((userDetails) => {
            localStorage.setItem(
              "userLocations",
              user?.userProperties?.locations
            );
            const authDetails = {
              authenticatedUser: formatCurrentUserDetails(userDetails),
              authenticated: authenticated,
              user: user,
              loginResponse,
              userUuid: user?.uuid,
              userLocations: user?.userProperties?.locations
                ? JSON.parse(
                    user?.userProperties?.locations
                      .split(`'`)
                      .join('"')
                      .split(" ")
                      .join("")
                  )
                : null,
            };
            return authDetails;
          })
        );
      })
    );
  }

  logout(credetialsToken): Observable<any> {
    const headers = {
      httpHeaders: {
        // Authorization: "Basic " + credetialsToken,
      },
    };
    return this.httpClient.delete("session", headers).pipe(
      tap(() => {
        sessionStorage.clear();
        localStorage.clear();
        this.clearCookie();
        this.cookieService.set("JSESSIONID" ,"0"); // setting the JSESSION cookie to 0 when user logs out
        this.cookieValue = this.cookieService.get("JSESSIONID") //printing the sessionid
      })
    );
  }

  getSession() {
    return this.httpClient.get("session").pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
