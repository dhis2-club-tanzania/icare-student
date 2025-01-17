import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { IssueStatusInput } from "src/app/shared/resources/store/models/issuing.model";
import { IssuingService } from "src/app/shared/resources/store/services/issuing.service";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import {
  acceptRequisitionIssue,
  acceptRequisitionIssueFail,
  acceptRequisitionIssueSuccess,
  cancelRequisition,
  cancelRequisitionFail,
  createRequest,
  createRequestFail,
  loadRequisitions,
  loadRequisitionsFail,
  receiveRequisition,
  receiveRequisitionFail,
  rejectRequisition,
  rejectRequisitionFail,
  removeRequisition,
  upsertRequisition,
  upsertRequisitions,
} from "../actions/requisition.actions";
import { AppState } from "../reducers";
import { getCurrentLocation } from "../selectors";

@Injectable()
export class RequisitionEffects {
  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitions),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentLocation(false))))
        )
      ),
      switchMap(([{}, currentLocation]) =>
        this.requisitionService.getAllRequisitions(currentLocation?.id).pipe(
          map(
            (requisitions) => upsertRequisitions({ requisitions }),
            catchError((error) => of(loadRequisitionsFail({ error })))
          )
        )
      )
    )
  );

  createRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRequest),
      switchMap(({ requisitionInput }) =>
        this.requisitionService.createRequest(requisitionInput).pipe(
          map(
            (requisition) => upsertRequisition({ requisition }),
            catchError((error) => of(createRequestFail({ error })))
          )
        )
      )
    )
  );

  acceptRequisitionIssue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptRequisitionIssue),
      switchMap(({ requisitionIssueInput }) =>
        this.requisitionService
          .acceptRequisitionIssue(requisitionIssueInput)
          .pipe(
            map((requisitionId) =>
              acceptRequisitionIssueSuccess({ requisitionId })
            ),
            catchError((error) => of(acceptRequisitionIssueFail({ error })))
          )
      )
    )
  );

  cancelRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelRequisition),
      switchMap(({ id, reason }) => {
        this.notificationService.show(
          new Notification({
            message: "Cancelling Requisition",
            type: "LOADING",
          })
        );
        return this.requisitionService
          .saveRequisitionStatus(id, reason, "CANCELLED")
          .pipe(
            map(() => {
              this.notificationService.show(
                new Notification({
                  message: "Requisition Successfuly cancelled",
                  type: "SUCCESS",
                })
              );
              return removeRequisition({ id });
            }),
            catchError((error) => {
              this.notificationService.show(
                new Notification({
                  message: "Cancelling Requisition Failed",
                  type: "ERROR",
                })
              );
              return of(cancelRequisitionFail({ id, error }));
            })
          );
      })
    )
  );

  receiveRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(receiveRequisition),
      switchMap(({ requisition }) => {
        this.notificationService.show(
          new Notification({
            message: "Receiving Requisition",
            type: "LOADING",
          })
        );
        return this.requisitionService.receiveRequisition(requisition).pipe(
          map((receivedRequisition) => {
            this.notificationService.show(
              new Notification({
                message: "Requisition Successfuly received",
                type: "SUCCESS",
              })
            );
            return upsertRequisition({ requisition: receivedRequisition });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Receiving Requisition Failed",
                type: "ERROR",
              })
            );
            return of(receiveRequisitionFail({ id: requisition.id, error }));
          })
        );
      })
    )
  );

  rejectRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectRequisition),
      switchMap(({ id, issueUuid, rejectionReason }) => {
        this.notificationService.show(
          new Notification({
            message: "Rejecting Requisition",
            type: "LOADING",
          })
        );

        const issueStatusInput: IssueStatusInput = {
          issueUuid,
          status: "REJECTED",
          remarks: rejectionReason,
        };
        return this.issuingService.saveIssueStatus(issueStatusInput).pipe(
          map(() => {
            this.notificationService.show(
              new Notification({
                message: "Requisition Successfuly cancelled",
                type: "SUCCESS",
              })
            );
            return removeRequisition({ id });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Rejecting Requisition Failed",
                type: "ERROR",
              })
            );
            return of(rejectRequisitionFail({ id, error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private requisitionService: RequisitionService,
    private issuingService: IssuingService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
