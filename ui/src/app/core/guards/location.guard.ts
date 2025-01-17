import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";

@Injectable({ providedIn: "root" })
export class LocationGuard  {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): any {
    this.store
      .pipe(select(getCurrentLocation(false)))
      .pipe(take(1))
      .subscribe((currentLocation: any) => {
        if (!currentLocation) {
          // this.router.navigate(['home']);
          return true;
        }

        return true;
      });
  }
}
