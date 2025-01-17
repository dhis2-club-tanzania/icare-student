import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import {
  saveDrugOrder,
  addDrugsOrdered,
  updateDrugOrder,
  dispenseDrug,
  dispenseDrugSuccess,
  dispenseDrugFail,
  saveDrugOrderFail,
  loadDrugOrders,
  loadDrugOrdersFail,
} from "../actions";
import {
  switchMap,
  map,
  catchError,
  concatMap,
  withLatestFrom,
} from "rxjs/operators";
import { of } from "rxjs";
import {
  NotificationService,
  Notification,
} from "src/app/shared/services/notification.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { getProviderDetails } from "../selectors/current-user.selectors";
import { getCurrentPatient } from "../selectors/current-patient.selectors";
import { getCurrentLocation, getDrugOrderEncounter } from "../selectors";
import { getActiveVisit } from "../selectors/visit.selectors";
import { getEncounterTypeByUuid } from "../selectors/encounter-type.selectors";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { DrugOrdersService } from "src/app/shared/resources/order/services";

@Injectable()
export class DrugOrdersEffects {
  constructor(
    private drugOrderService: DrugOrdersService,
    private actions$: Actions,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {}

  loadDrugOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDrugOrders),
      switchMap(({ uuids }) =>
        this.drugOrderService.getDrugOrders(uuids).pipe(
          map((drugOrders) => addDrugsOrdered({ drugOrders })),
          catchError((error) => of(loadDrugOrdersFail({ error })))
        )
      )
    )
  );

  // drugOrder$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(saveDrugOrder),
  //     concatMap((action) =>
  //       of(action).pipe(
  //         withLatestFrom(
  //           this.store.select(getProviderDetails),
  //           this.store.pipe(select(getCurrentPatient)),
  //           this.store.pipe(select(getCurrentLocation(false))),
  //           this.store.pipe(select(getActiveVisit)),
  //           this.store.pipe(select(getDrugOrderEncounter)),
  //           this.store.pipe(
  //             select(getEncounterTypeByUuid, {
  //               uuid: ICARE_CONFIG?.dispensing?.encounterTypeUuid,
  //             })
  //           )
  //         )
  //       )
  //     ),
  //     switchMap(
  //       ([
  //         action,
  //         provider,
  //         currentPatient,
  //         currentLocation,
  //         activeVisit,
  //         drugOrderEncounter,
  //         encounterType,
  //       ]) => {
  //         const dispensingEncounter = {
  //           // encounterDatetime: new Date().toISOString(),
  //           visit: activeVisit?.uuid,
  //           patient: currentPatient?.id,
  //           encounterType: encounterType?.uuid,
  //           location: currentLocation?.uuid,
  //           // TODO: Find best way to get encounter provider details
  //           encounterProviders: [
  //             {
  //               provider: provider?.uuid,
  //               encounterRole: '240b26f9-dd88-4172-823d-4a8bfeb7841f',
  //             },
  //           ],
  //         };

  //         this.notificationService.show(
  //           new Notification({
  //             message: 'Saving Prescription details...',
  //             type: 'LOADING',
  //           })
  //         );

  //         const localCurrentDispensing = JSON.parse(
  //           localStorage.getItem('currentDispensing')
  //         );

  //         return (
  //           action.isDispensing
  //             ? localCurrentDispensing?.patientUuid === currentPatient?.id
  //               ? of(localCurrentDispensing)
  //               : this.drugOrderService.getDrugOrderEncounter(
  //                   dispensingEncounter
  //                 )
  //             : of(null)
  //         ).pipe(
  //           switchMap((dispensingEncounterResult) => {
  //             return this.drugOrderService
  //               .saveDrugOrder(
  //                 action.isDispensing
  //                   ? {
  //                       ...action.drugOrder,
  //                       encounter: dispensingEncounterResult.encounterUuid,
  //                     }
  //                   : action.drugOrder
  //               )
  //               .pipe(
  //                 map((response) => {
  //                   this.notificationService.show(
  //                     new Notification({
  //                       message: 'Prescription saved successfully',
  //                       type: 'SUCCESS',
  //                     })
  //                   );

  //                   return addDrugsOrdered({
  //                     drugOrders: [{ ...response, id: response.uuid }],
  //                   });
  //                 }),
  //                 catchError((error) => {
  //                   this.notificationService.show(
  //                     new Notification({
  //                       message: 'Error saving prescription',
  //                       type: 'ERROR',
  //                       autoClose: false,
  //                     })
  //                   );

  //                   return of(saveDrugOrderFail({ error }));
  //                 })
  //               );
  //           })
  //         );
  //       }
  //     )
  //   )
  // );

  updateDrugOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDrugOrder),
      switchMap((action) => {
        this.notificationService.show(
          new Notification({
            message: "Saving Prescription details...",
            type: "LOADING",
          })
        );
        return this.drugOrderService.updateDrugOrder(action.drugOrder).pipe(
          map((response) => {
            this.notificationService.show(
              new Notification({
                message: "Prescription saved successfully",
                type: "SUCCESS",
              })
            );

            return addDrugsOrdered({
              drugOrders: { ...response, id: response.uuid },
            });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Error saving prescription",
                type: "ERROR",
                autoClose: false,
              })
            );
            return of(saveDrugOrderFail({ error }));
          })
        );
      })
    )
  );

  dispenseDrug$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dispenseDrug),
      switchMap(({ drugOrder }) => {
        this.notificationService.show(
          new Notification({
            message: "Dispensing prescription...",
            type: "LOADING",
          })
        );
        return this.drugOrderService.saveDrugOrder(drugOrder, "DISPENSE").pipe(
          map((res) => {
            this.notificationService.show(
              new Notification({
                message: "Prescription dispensed successfully",
                type: "SUCCESS",
              })
            );

            return dispenseDrugSuccess({ drugOrder });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Error dispensing prescription",
                type: "ERROR",
                autoClose: false,
              })
            );
            return of(dispenseDrugFail({ drugOrder, error }));
          })
        );
      })
    )
  );
}
