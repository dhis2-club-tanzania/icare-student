import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay, mergeMap } from 'rxjs/operators';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  BASE_URL = '../../../openmrs/ws/rest/v1/';
  constructor(private httpClient: HttpClient) {}

  // openmrs/ws/rest/v1/visit?includeInactive=true&patient=17454676-46fb-4b68-a88c-b960d977d625&v=custom:(uuid,visitType,startDatetime,stopDatetime,location,encounters:(uuid))
  // get constant from global variable: openmrs/ws/rest/v1/bahmnicore/sql/globalproperty?property=bahmni.pharmacy.daysLeftToExpiryAlert
  getVisitDetailsForCurrentPatient(patientId) {}

  getBasicDetailFrom() {}

  saveObs(data): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'obs', data);
  }

  getObsDetails(encounterUuid): Observable<any> {
    return this.httpClient.get(
      this.BASE_URL +
        'encounter/' +
        encounterUuid +
        '?v=custom:(obs:(uuid,display,value,concept:(uuid,display)))'
    );
  }

  deleteObs(uuid): Observable<any> {
    return this.httpClient.delete(
      this.BASE_URL + 'obs/' + uuid + '?purge=true'
    );
  }

  getBillingInformation(): Observable<any> {
    return this.httpClient.get(
      this.BASE_URL +
        'billing/quotation/read/dates/indexed?endDate=2020-09-24&endIndex=10&isAscending=false&startDate=2020-09-15&startIndex=1'
    );
  }

  async getOrderResults(patientUuid) {
    return await this.httpClient
      .get(
        this.BASE_URL + 'bahmnicore/labOrderResults?patientUuid=' + patientUuid
      )
      .pipe(delay(1000))
      .toPromise();
  }

  uploadFileToBahmni(data): Observable<any> {
    return this.httpClient.post(
      this.BASE_URL + 'bahmnicore/visitDocument/uploadDocument',
      data
    );
  }

  getLabOrders(): Observable<any> {
    const data = new Observable((observer) => {
      this.httpClient
        .get(
          this.BASE_URL +
            'billing/quotation/read/dates/indexed?endDate=2020-09-24&endIndex=30&isAscending=false&startDate=2020-09-15&startIndex=1'
        )
        .subscribe(
          (patientsBillingInfos: any) => {
            if (patientsBillingInfos) {
              let idsLoaded = {};
              let allPatientsOrders = [];
              _.each(patientsBillingInfos, (billingInfo) => {
                idsLoaded[billingInfo.patient.uuid]
                  ? ''
                  : this.getOrderResults(billingInfo.patient.uuid).then(
                      (labOrders) => {
                        let orders = labOrders;
                        orders = {
                          ...orders,
                          ...{ id: billingInfo.patient.uuid },
                        };
                        orders = {
                          ...orders,
                          ...{ patient: billingInfo.patient },
                        };
                        orders = {
                          ...orders,
                          ...{ visit: billingInfo.visit },
                        };
                        orders = {
                          ...orders,
                          ...{ dateOrdered: billingInfo.dateOrdered },
                        };

                        orders = {
                          ...orders,
                          ...{ discounted: billingInfo.discounted },
                        };

                        orders = {
                          ...orders,
                          ...{
                            totalQuotedAmount: billingInfo.totalQuotedAmount,
                          },
                        };

                        orders = {
                          ...orders,
                          ...{
                            totalDiscountedAmount:
                              billingInfo.totalDiscountedAmount,
                          },
                        };

                        orders = {
                          ...orders,
                          ...{
                            totalPayableAmount: billingInfo.totalPayableAmount,
                          },
                        };

                        orders = {
                          ...orders,
                          ...{
                            orderedBy: billingInfo.orderedBy,
                          },
                        };

                        let filteredQts = _.filter(
                          patientsBillingInfos,
                          (patientsBillingInfo) => {
                            let itemsMatched = [];
                            _.map(
                              patientsBillingInfo.saleQuoteLineList,
                              (list) => {
                                _.map(
                                  labOrders['results']
                                    ? labOrders['results']
                                    : [],
                                  (labOrderResult) => {
                                    if (
                                      labOrderResult['testName'].split(
                                        ' - '
                                      )[1] == list.item.name
                                    ) {
                                      itemsMatched = [...itemsMatched, list];
                                    }
                                  }
                                );
                              }
                            );
                            if (itemsMatched.length > 0) return itemsMatched;
                          }
                        );

                        if (filteredQts.length > 0) {
                          orders = {
                            ...orders,
                            ...{
                              quotes: filteredQts,
                            },
                          };
                          allPatientsOrders = [...allPatientsOrders, orders];
                          observer.next(allPatientsOrders);
                        }
                      }
                    );
                idsLoaded[billingInfo.patient.uuid] = billingInfo.patient.uuid;
              });
            } else {
              observer.next(patientsBillingInfos);
              observer.complete();
            }
          },
          (error) => {
            observer.error(error);
          }
        );
    });
    return data;
  }
}
