import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadLabOrdersBillingInformation,
  addLoadedLabOrdersBillingInfo,
  loadingLabOrderBillingInfoFails,
  getBillingInfoByVisitUuid,
  getBillingInfoBymRNo,
} from '../actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as _ from 'lodash';
import { LabOrdersBillingService } from 'src/app/shared/services/billing-info.service';
import { formatBillingInfo } from 'src/app/shared/helpers/lab-order-billing-info.helper';

@Injectable()
export class LabOrdersBillingInfoEffects {
  constructor(
    private actions$: Actions,
    private billingService: LabOrdersBillingService
  ) {}

  labOrdersBillingInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLabOrdersBillingInformation),
      switchMap((action) =>
        this.billingService.getLabOrdersBillingInfo(action.parameters).pipe(
          map((labOrdersBillingInfo) => {
            return addLoadedLabOrdersBillingInfo({
              ordersBillingInfo: formatBillingInfo(labOrdersBillingInfo),
            });
          }),
          catchError((error) => of(loadingLabOrderBillingInfoFails({ error })))
        )
      )
    )
  );

  // patientLabOrdersBillingInfo$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getBillingInfoByVisitUuid),
  //     switchMap((action) =>
  //       this.billingService.billingInfoByVisit(action.visitUuid).pipe(
  //         map((labOrdersBillingInfo) => {
  //           // console.log('labOrdersBillingInfo', labOrdersBillingInfo);
  //           return addLoadedLabOrdersBillingInfo({
  //             ordersBillingInfo: formatPaidItemsFromBilling(
  //               labOrdersBillingInfo
  //             ),
  //           });
  //         }),
  //         catchError((error) => of(loadingLabOrderBillingInfoFails({ error })))
  //       )
  //     )
  //   )
  // );

  patientLabOrdersBillingInfoByMRN$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBillingInfoBymRNo),
      switchMap((action) =>
        this.billingService
          .billingInfoBymRN(action.mrn, action.visitsParameters)
          .pipe(
            map((response) => {
              let billingInfo = {};
              _.map(response, (billingData) => {
                _.map(billingData?.orderByQuoteLines, (qLine) => {
                  if (
                    qLine?.paidAmount >= qLine?.saleQuoteLine?.payableAmount ||
                    qLine?.saleQuoteLine?.paymentCategory?.Id == 4031
                  )
                    billingInfo[
                      billingData?.saleQuote?.visit?.uuid +
                        '-' +
                        qLine?.saleQuoteLine?.item?.uuid
                    ] = qLine;
                });
              });
              return addLoadedLabOrdersBillingInfo({
                ordersBillingInfo: billingInfo,
              });
            }),
            catchError((error) =>
              of(loadingLabOrderBillingInfoFails({ error }))
            )
          )
      )
    )
  );
}
