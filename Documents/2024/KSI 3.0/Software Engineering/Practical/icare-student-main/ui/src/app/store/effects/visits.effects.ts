import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadActiveVisits,
  addLoadedVisitsDetails,
  loadingVisitsDetailsFails,
  loadActiveVisitsForSampleManagement,
  loadActiveVisitsWithLabOrders,
  addLoadedActiveVisitsWithLabOrders,
  loadingActiveVisitsWithLabOrdersFails,
  loadPatientsDetails,
  loadPatientsVisitDetailsByVisitUuids,
  loadingPatientsVisitsFails,
  addPatientVisitsDetails,
  loadAllLabActiveVisitDetailsByVisitUuids,
} from '../actions';
import {
  switchMap,
  map,
  catchError,
  concatMap,
  withLatestFrom,
} from 'rxjs/operators';
import { from, of, zip } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../reducers';
import { VisitsService } from 'src/app/shared/services/visits.service';

@Injectable()
export class VisitsEffects {
  constructor(
    private actions$: Actions,
    private visitsService: VisitsService,
    private store: Store<AppState>,
    private httpClient: HttpClient
  ) {}
  // .getLabVisitsWithOrdersInformation(action.startDate, action.endDate)
  // .getActiveVisitsByStartDate(action.startDate, action.endDate)
  activeVisitsWithLabOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActiveVisitsWithLabOrders),
      switchMap((action) =>
        this.visitsService
          .getLabVisitsWithOrdersInformation(action.startDate, action.endDate)
          .pipe(
            //TODO JESSE - fix connection btn billing, visits and orders
            map((response) => {
              const labOrdersCollectionDetails = response[2].filter(
                (orderDetails) => orderDetails.item_id !== ''
              );
              const billingDetails = response[1];
              const patientsEncountered = response[0];
              const labOrdersSampleDetails = response[3];

              const mergedLabOrders = _.values(
                _.merge(
                  _.keyBy(labOrdersCollectionDetails, 'order_id'),
                  _.keyBy(labOrdersSampleDetails, 'order_id')
                )
              );

              const ordersWithBillingAndCollectionDetails =
                _.values(
                  _.merge(
                    _.keyBy(
                      mergedLabOrders.filter((order) => order.order_number) ||
                        [],
                      'order_number'
                    ),
                    _.keyBy(billingDetails, 'order_number')
                  )
                ).filter((order) => order.p_category) || [];

              // console.log('billingDetails', billingDetails.length);
              // console.log(
              //   'merged',
              //   (mergedLabOrders.filter((order) => order.order_number) || [])
              //     .length
              // );

              // console.log(
              //   'ordersWithBillingAndCollectionDetails',
              //   ordersWithBillingAndCollectionDetails
              // );
              // console.log(
              //   ordersWithBillingAndCollectionDetails.filter(
              //     (order) => order.p_category
              //   )
              // );
              const patientsMergedWithOrders = patientsEncountered
                .map((patientOrderDetails) => {
                  return {
                    ...patientOrderDetails,
                    orderedItems:
                      ordersWithBillingAndCollectionDetails.filter(
                        (orderWithBillingAndCollectionDetails) =>
                          orderWithBillingAndCollectionDetails.patient_id ===
                          patientOrderDetails.patient_id
                      ) || [],
                  };
                })
                .filter(
                  (formattedPatientDetails) =>
                    formattedPatientDetails.orderedItems.length > 0
                );

              // console.log('patientsMergedWithOrders', patientsMergedWithOrders);
              // const groupedOrders = _.groupBy(response, 'identifier');
              const formattedData = patientsMergedWithOrders.map(
                (patientInfo) => {
                  const reCollect =
                    _.orderBy(
                      _.groupBy(patientInfo['orderedItems'], 'concept_uuid'),
                      ['sample_collection_date'],
                      ['desc']
                    )[0]?.recollection === 'RECOLLECT'
                      ? true
                      : false;
                  return {
                    ...patientInfo,
                    id: patientInfo?.uuid,
                    reCollection: reCollect,
                    searchingText: patientInfo?.name + patientInfo?.identifier,
                    orders: patientInfo['orderedItems'].map((orderedItem) => {
                      return {
                        ...patientInfo,
                        searchingText:
                          patientInfo?.name + patientInfo?.identifier,
                        ...orderedItem,
                        identifier: patientInfo?.identifier,
                        reCollection: reCollect,
                        collected:
                          orderedItem.collected != '' &&
                          orderedItem.sample_identifier
                            ? true
                            : false,
                      };
                    }),
                    allOrdersCollected:
                      patientInfo['orderedItems'].length ==
                      (
                        _.filter(patientInfo['orderedItems'], (order) => {
                          if (
                            order?.collected != '' &&
                            order.sample_identifier
                          ) {
                            return order;
                          }
                        }) || []
                      )?.length >
                        0
                        ? true
                        : false,
                  };
                }
              );
              // console.log('formattedData', formattedData);
              return addLoadedActiveVisitsWithLabOrders({
                activeVisits: formattedData,
              });
            }),
            catchError((error) =>
              of(loadingActiveVisitsWithLabOrdersFails({ error }))
            )
          )
      )
    )
  );

  activeVisitsDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPatientsVisitDetailsByVisitUuids),
      switchMap((action) => {
        return this.visitsService.getActiveVisitDetails(action.visits).pipe(
          map((response) => {
            // console.log('response', response);
            return addPatientVisitsDetails({
              visits: _.map(response, (visit) => {
                return {
                  ...visit,
                  id: visit?.uuid,
                };
              }),
            });
          }),
          catchError((error) => of(loadingPatientsVisitsFails({ error })))
        );
      })
    )
  );

  labActiveVisitsDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllLabActiveVisitDetailsByVisitUuids),
      switchMap((action) =>
        this.visitsService.getActiveVisitDetails(action.visits).pipe(
          map((response) => {
            // console.log('response', response);
            return addPatientVisitsDetails({
              visits: _.map(response, (visit) => {
                return {
                  ...visit,
                  id: visit?.uuid,
                };
              }),
            });
          }),
          catchError((error) => of(loadingPatientsVisitsFails({ error })))
        )
      )
    )
  );
}
