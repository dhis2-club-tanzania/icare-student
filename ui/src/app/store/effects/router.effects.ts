import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { back, forward, go } from "../actions/router.actions";

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(go),
        tap(({ path, query, extras }) => {
          // Set navigation details to local storage
          localStorage.setItem(
            "navigationDetails",
            JSON.stringify({ path, queryParams: query?.queryParams })
          );
          this.router.navigate(path, {
            queryParams: { ...query?.queryParams, ...extras },
          });
        })
      ),
    {
      dispatch: false,
    }
  );

  // navigateBack$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(back),
  //       tap(() => {
  //         this.location.back();
  //       })
  //     ),
  //   {
  //     dispatch: false,
  //   }
  // );

  // navigateForward$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(forward),
  //       tap(() => {
  //         this.location.forward();
  //       })
  //     ),
  //   {
  //     dispatch: false,
  //   }
  // );
}
