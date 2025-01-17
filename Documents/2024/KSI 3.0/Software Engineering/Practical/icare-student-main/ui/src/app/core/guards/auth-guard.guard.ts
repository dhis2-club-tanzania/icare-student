import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  CanActivate,
  CanDeactivate,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { first, map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.session().pipe(
      first(),
      map((session) => {
        const localSession = sessionStorage.getItem("JSESSIONID");
        if (!session?.authenticated || !localSession) {
          this.router.navigate(["/login"]);
        }
        return session?.authenticated;
      })
    );
  }
}
