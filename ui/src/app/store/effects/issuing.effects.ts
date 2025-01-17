import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { IssuingService } from "src/app/shared/resources/store/services/issuing.service";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import { setCurrentUserCurrentLocation } from "../actions";
import {
  issueRequest,
  issueRequestFail,
  loadIssuings,
  loadIssuingsFail,
  rejectRequisition,
  rejectRequisitionFail,
  removeIssue,
  upsertIssuings,
} from "../actions/issuing.actions";
import { upsertRequisition } from "../actions/requisition.actions";
import { AppState } from "../reducers";
import { getCurrentLocation, getUrl } from "../selectors";
import { getIssuingLoadingState } from "../selectors/issuing.selectors";

@Injectable()
export class IssuingEffects {
  loadIssuings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIssuings),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentLocation(false))))
        )
      ),
      switchMap(([{}, currentLocation]) => {
        return this.issuingService.getAllIssuings(currentLocation?.id).pipe(
          map((issuings) => {
            this.notificationService.show(
              new Notification({
                message: "Requisitions for issuing succeccfully loaded",
                type: "SUCCESS",
              })
            );
            return upsertIssuings({ issuings });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Problem loading requisitions for issuing",
                type: "ERROR",
              })
            );
            return of(loadIssuingsFail({ error }));
          })
        );
      })
    )
  );

  issueRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(issueRequest),
      switchMap(({ issueInput, id }) => {
        this.notificationService.show(
          new Notification({ message: "Issuing Requisition", type: "LOADING" })
        );
        return this.issuingService.issueRequest(issueInput).pipe(
          map((response) => {
            this.notificationService.show(
              new Notification({
                message: response?.message
                  ? response?.message
                  : "Requisition issued successfully",
                type: !response?.message ? "SUCCESS" : "ERROR",
              })
            );
            return !response?.message
              ? removeIssue({ id })
              : issueRequestFail({ id, error: response?.message });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Problem issuing requisition",
                type: "ERROR",
              })
            );
            return of(issueRequestFail({ id, error }));
          })
        );
      })
    )
  );

  rejectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectRequisition),
      switchMap(({ id, reason }) => {
        this.notificationService.show(
          new Notification({
            message: "Rejecting Requisition",
            type: "LOADING",
          })
        );
        return this.requisitionService
          .saveRequisitionStatus(id, reason, "REJECTED")
          .pipe(
            map(() => {
              this.notificationService.show(
                new Notification({
                  message: "Requisition rejected successfully",
                  type: "SUCCESS",
                })
              );
              return removeIssue({ id });
            }),
            catchError((error) => {
              this.notificationService.show(
                new Notification({
                  message: "Problem rejecting requisition",
                  type: "ERROR",
                })
              );
              return of(rejectRequisitionFail({ id, error }));
            })
          );
      })
    )
  );

  // setCurrentLocation$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(setCurrentUserCurrentLocation),
  //       concatMap((action) =>
  //         of(action).pipe(
  //           withLatestFrom(
  //             this.store.pipe(select(getIssuingLoadingState)),
  //             this.store.pipe(select(getUrl))
  //           )
  //         )
  //       ),
  //       tap(([{ location }, loadingIssuing, url]) => {
  //         console.log(location, loadingIssuing, url);
  //       })
  //     ),
  //   { dispatch: false }
  // );

  constructor(
    private actions$: Actions,
    private issuingService: IssuingService,
    private requisitionService: RequisitionService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
